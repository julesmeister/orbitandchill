// Test file for console.log removal

function testFunction() {

    'Multi-line console log',
    { data: 'some data' },
    'more text'
  );
  
  // This should stay
  console.error('This is an error');
  console.warn('This is a warning');
  
  const data = { foo: 'bar' };
  
  // Complex nested console.log
  if (true) {
      complexObject: {
        nested: true,
        values: [1, 2, 3]
      },
      timestamp: Date.now()
    });
  }
  
  // This should also stay
  console.info('Info message');
  
  return 'done';
}