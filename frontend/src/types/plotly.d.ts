declare module 'plotly.js-dist-min' {
  export * from 'plotly.js';
  const Plotly: typeof import('plotly.js');
  export default Plotly;
}
