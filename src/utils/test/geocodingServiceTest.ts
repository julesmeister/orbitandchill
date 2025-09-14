/* eslint-disable @typescript-eslint/no-unused-vars */

import { GeocodingService, BirthDataWithCoordinates } from '../../services/businessServices/geocodingService';
import { CoordinateValidators } from '../validators/coordinateValidators';
import { GeocodingConfig } from '../../config/geocodingConfig';

/**
 * Simple test utility to verify the refactored geocoding architecture
 * This can be run in browser console for quick testing
 */
export class GeocodingServiceTest {

  /**
   * Test coordinate validation functionality
   */
  static testCoordinateValidation() {
    console.log('🧪 TESTING: Coordinate Validation');

    // Test valid coordinates
    const validCoords = { lat: '14.5995', lon: '120.9842' };
    const validation = GeocodingService.validateCoordinates(validCoords);
    console.log('✅ Valid coordinates test:', validation.isValid ? 'PASS' : 'FAIL', validation);

    // Test invalid coordinates (empty)
    const invalidCoords = { lat: '', lon: '' };
    const invalidValidation = GeocodingService.validateCoordinates(invalidCoords);
    console.log('✅ Invalid coordinates test:', !invalidValidation.isValid ? 'PASS' : 'FAIL', invalidValidation);

    // Test out of range coordinates
    const outOfRangeCoords = { lat: '200', lon: '-200' };
    const rangeValidation = GeocodingService.validateCoordinates(outOfRangeCoords);
    console.log('✅ Out of range test:', !rangeValidation.isValid ? 'PASS' : 'FAIL', rangeValidation);

    return { validCoords, invalidCoords, outOfRangeCoords };
  }

  /**
   * Test fallback coordinate functionality
   */
  static testFallbackCoordinates() {
    console.log('🧪 TESTING: Fallback Coordinates');

    // Test Zamboanga del Sur, Philippines
    const zambResult = GeocodingService.findFallbackCoordinates('Zamboanga del Sur, Philippines');
    console.log('✅ Zamboanga fallback:', zambResult ? 'PASS' : 'FAIL', zambResult);

    // Test general Philippines
    const philResult = GeocodingService.findFallbackCoordinates('Philippines');
    console.log('✅ Philippines fallback:', philResult ? 'PASS' : 'FAIL', philResult);

    // Test non-existent location
    const unknownResult = GeocodingService.findFallbackCoordinates('Unknown Location');
    console.log('✅ Unknown location fallback:', !unknownResult ? 'PASS' : 'FAIL', unknownResult);

    return { zambResult, philResult, unknownResult };
  }

  /**
   * Test full coordinate processing workflow
   */
  static testCoordinateProcessing() {
    console.log('🧪 TESTING: Coordinate Processing Workflow');

    // Test with valid coordinates
    const validBirthData: BirthDataWithCoordinates = {
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      locationOfBirth: 'Manila, Philippines',
      coordinates: { lat: '14.5995', lon: '120.9842' }
    };

    try {
      const validResult = GeocodingService.processCoordinates(validBirthData);
      console.log('✅ Valid processing:', validResult.source === 'original' ? 'PASS' : 'FAIL', validResult);
    } catch (error) {
      console.log('❌ Valid processing: FAIL', error);
    }

    // Test with empty coordinates (should use fallback)
    const fallbackBirthData: BirthDataWithCoordinates = {
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      locationOfBirth: 'Zamboanga del Sur, Philippines',
      coordinates: { lat: '', lon: '' }
    };

    try {
      const fallbackResult = GeocodingService.processCoordinates(fallbackBirthData);
      console.log('✅ Fallback processing:', fallbackResult.source === 'fallback' ? 'PASS' : 'FAIL', fallbackResult);
    } catch (error) {
      console.log('❌ Fallback processing: FAIL', error);
    }

    // Test with no fallback available
    const noFallbackBirthData: BirthDataWithCoordinates = {
      dateOfBirth: '1990-01-01',
      timeOfBirth: '12:00',
      locationOfBirth: 'Unknown City, Unknown Country',
      coordinates: { lat: '', lon: '' }
    };

    try {
      const noFallbackResult = GeocodingService.processCoordinates(noFallbackBirthData);
      console.log('❌ No fallback processing: FAIL - should have thrown error', noFallbackResult);
    } catch (error) {
      console.log('✅ No fallback processing: PASS - correctly threw error', error.message);
    }

    return { validBirthData, fallbackBirthData, noFallbackBirthData };
  }

  /**
   * Test validator utility functions
   */
  static testValidatorUtilities() {
    console.log('🧪 TESTING: Validator Utilities');

    const validCoords = { lat: '14.5995', lon: '120.9842' };
    const invalidCoords = { lat: '', lon: '' };
    const outOfRangeCoords = { lat: '200', lon: '-200' };

    // Test type guards
    console.log('✅ isCoordinateObject:', CoordinateValidators.isCoordinateObject(validCoords) ? 'PASS' : 'FAIL');
    console.log('✅ hasNonEmptyCoordinates:', CoordinateValidators.hasNonEmptyCoordinates(validCoords) ? 'PASS' : 'FAIL');
    console.log('✅ areParseable:', CoordinateValidators.areParseable(validCoords) ? 'PASS' : 'FAIL');
    console.log('✅ areInValidRange:', CoordinateValidators.areInValidRange(validCoords) ? 'PASS' : 'FAIL');

    // Test invalid coordinates
    console.log('✅ hasNonEmptyCoordinates (invalid):', !CoordinateValidators.hasNonEmptyCoordinates(invalidCoords) ? 'PASS' : 'FAIL');
    console.log('✅ areInValidRange (out of range):', !CoordinateValidators.areInValidRange(outOfRangeCoords) ? 'PASS' : 'FAIL');

    // Test precision
    const precisionLow = { lat: '14', lon: '120' };
    const precisionHigh = { lat: '14.5995123', lon: '120.9842456' };

    console.log('✅ Precision low:', CoordinateValidators.getPrecisionLevel(precisionLow) === 'low' ? 'PASS' : 'FAIL');
    console.log('✅ Precision high:', CoordinateValidators.getPrecisionLevel(precisionHigh) === 'high' ? 'PASS' : 'FAIL');

    return { validCoords, invalidCoords, outOfRangeCoords, precisionLow, precisionHigh };
  }

  /**
   * Test configuration functionality
   */
  static testConfiguration() {
    console.log('🧪 TESTING: Configuration');

    // Test configuration validation
    const configValidation = GeocodingConfig.validateConfiguration();
    console.log('✅ Configuration valid:', configValidation.isValid ? 'PASS' : 'FAIL', configValidation);

    // Test statistics
    const stats = GeocodingConfig.getConfigurationStats();
    console.log('✅ Configuration stats:', stats.totalLocations > 0 ? 'PASS' : 'FAIL', stats);

    // Test supported regions
    const regions = GeocodingConfig.getSupportedRegions();
    console.log('✅ Supported regions:', regions.length > 0 ? 'PASS' : 'FAIL', `${regions.length} regions`);

    // Test keyword search
    const philippineLocations = GeocodingConfig.getFallbackLocationsByKeyword('philippines');
    console.log('✅ Philippines locations:', philippineLocations.length > 0 ? 'PASS' : 'FAIL', philippineLocations.length);

    return { configValidation, stats, regions, philippineLocations };
  }

  /**
   * Run all tests
   */
  static runAllTests() {
    console.log('🧪 STARTING: Geocoding Service Architecture Tests');
    console.log('=========================================');

    const results = {
      validation: this.testCoordinateValidation(),
      fallback: this.testFallbackCoordinates(),
      processing: this.testCoordinateProcessing(),
      validators: this.testValidatorUtilities(),
      configuration: this.testConfiguration()
    };

    console.log('=========================================');
    console.log('🧪 COMPLETED: All tests finished');
    console.log('✅ Check console output above for individual test results');

    return results;
  }

  /**
   * Test real-world astrocartography scenarios
   */
  static testAstrocartographyScenarios() {
    console.log('🧪 TESTING: Astrocartography Scenarios');

    // Scenario 1: Person with complete data
    const completePersonData = {
      id: 'test-1',
      name: 'Test User',
      birthData: {
        dateOfBirth: '1990-05-15',
        timeOfBirth: '14:30',
        locationOfBirth: 'Manila, Philippines',
        coordinates: { lat: '14.5995', lon: '120.9842' }
      }
    };

    console.log('✅ Complete data scenario:', completePersonData);

    // Scenario 2: Person with empty coordinates
    const emptyCoordPersonData = {
      id: 'test-2',
      name: 'Test User 2',
      birthData: {
        dateOfBirth: '1985-12-03',
        timeOfBirth: '09:15',
        locationOfBirth: 'Zamboanga del Sur, Philippines',
        coordinates: { lat: '', lon: '' }
      }
    };

    console.log('✅ Empty coordinates scenario:', emptyCoordPersonData);

    // Test processing both scenarios
    try {
      const birthDataWithCoords1 = {
        dateOfBirth: completePersonData.birthData.dateOfBirth,
        timeOfBirth: completePersonData.birthData.timeOfBirth,
        locationOfBirth: completePersonData.birthData.locationOfBirth,
        coordinates: completePersonData.birthData.coordinates
      };

      const result1 = GeocodingService.processCoordinates(birthDataWithCoords1);
      console.log('✅ Complete data processing:', result1.source === 'original' ? 'PASS' : 'FAIL');

      const birthDataWithCoords2 = {
        dateOfBirth: emptyCoordPersonData.birthData.dateOfBirth,
        timeOfBirth: emptyCoordPersonData.birthData.timeOfBirth,
        locationOfBirth: emptyCoordPersonData.birthData.locationOfBirth,
        coordinates: emptyCoordPersonData.birthData.coordinates
      };

      const result2 = GeocodingService.processCoordinates(birthDataWithCoords2);
      console.log('✅ Empty coordinates processing:', result2.source === 'fallback' ? 'PASS' : 'FAIL');

      return { completePersonData, emptyCoordPersonData, result1, result2 };
    } catch (error) {
      console.log('❌ Astrocartography scenario processing: FAIL', error);
      return null;
    }
  }
}

// Export for use in browser console or other tests
(globalThis as any).GeocodingServiceTest = GeocodingServiceTest;