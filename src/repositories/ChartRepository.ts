/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'dexie';
import { NatalChartStorage } from '@/types/database';

export class ChartRepository {
  constructor(private natalCharts: Table<NatalChartStorage>) {}

  async save(chart: NatalChartStorage): Promise<void> {
    await this.natalCharts.put(chart);
  }

  async getByUserId(userId: string): Promise<NatalChartStorage[]> {
    const charts = await this.natalCharts
      .where("userId")
      .equals(userId)
      .toArray();

    // Sort by createdAt in descending order (most recent first)
    return charts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async delete(chartId: string): Promise<void> {
    await this.natalCharts.delete(chartId);
  }

  async getById(chartId: string): Promise<NatalChartStorage | null> {
    const chart = await this.natalCharts.get(chartId);
    return chart || null;
  }

  async getByType(userId: string, chartType: NatalChartStorage['chartType']): Promise<NatalChartStorage[]> {
    const charts = await this.natalCharts
      .where("userId")
      .equals(userId)
      .and(chart => chart.chartType === chartType)
      .toArray();

    return charts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getByPersonId(userId: string, personId: string): Promise<NatalChartStorage[]> {
    const charts = await this.natalCharts
      .where("userId")
      .equals(userId)
      .and(chart => chart.metadata?.personId === personId)
      .toArray();

    return charts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}