
function canvasOnCreated(state) {
  console.log('canvasOnCreated')
  let gl = state.gl;
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.BasicShadowMap;
  handlePixelStorei(state);
}

//  EXGL: gl.pixelStorei() doesn't support this parameter yet!
function handlePixelStorei(state) {
  let _gl = state.gl.getContext();
  const pixelStorei = _gl.pixelStorei.bind(_gl);
  _gl.pixelStorei = function (...args) {
    const [parameter] = args;
    switch (parameter) {
      case _gl.UNPACK_FLIP_Y_WEBGL:
        return pixelStorei(...args);
    }
  }
}

const glProps = {
  antialias: false,
  logarithmicDepthBuffer: true
};

export { canvasOnCreated, glProps }