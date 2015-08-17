importScripts('components/bridge/client.js');

var client = bridge.client({
  service: 'music-service',
  endpoint: new BroadcastChannel('music-service')
});

function ArtistsService(worker) {
  var stopAfter = ServiceWorkerWare.decorators.stopAfter;

  worker.get('/api/artists/list', stopAfter((request) => {
    return new Promise((resolve) => {
      client.method('getArtists').then((artists) => {
        resolve(new Response(JSON.stringify(artists), {
          headers: { 'Content-Type': 'application/json' }
        }));
      });
    });
  }));

  worker.get('/api/artists/info/:filePath', stopAfter((request) => {
    return new Promise((resolve) => {
      var filePath = '/' + decodeURIComponent(request.parameters.filePath);
      client.method('getArtist', filePath)
        .then((songs) => {
          resolve(new Response(JSON.stringify(songs), {
            headers: { 'Content-Type': 'application/json' }
          }));
        })
        .catch((error) => {
          resolve(new Response('', { status: 404 }));
        });
    });
  }));
}
