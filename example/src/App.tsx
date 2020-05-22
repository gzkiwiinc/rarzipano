import * as React from 'react';
import { Viewer, Scene, createRectilinearView, createCubeGeometry, generateSourceFromTile, createImageUrlSource } from 'rarzipano';

export default class App extends React.Component<{}, {}>
{
  private urlPrefix = 'https://oss.meshkit.cn/mesh-panorama/panorama/861338697736213/329/7a7a3a44'

  render()
  {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
      >
        <Viewer>
          <Scene
            opts={{
              view: createRectilinearView(),
              geometry: createCubeGeometry(),
              source: createImageUrlSource(generateSourceFromTile(this.urlPrefix))
            }}
            switchTo={true}
          />
        </Viewer>
      </div>
    )
  }
}