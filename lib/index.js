class Distribution {
  static getAll() {
    if (!Distribution.all) Distribution.all = new Map();
    return Distribution.all;
  }

  static get(name) {
    return Distribution.getAll().get(name);
  }

  static has(name) {
    return Distribution.getAll().has(name);
  }

  static set(dist) {
    let all = Distribution.getAll();
    all.set(dist.name, dist);
    let resolvers = Distribution.getResolversByName(dist.name);

    for (let _resolve of resolvers) {
      _resolve(dist);
    }

    Distribution.clearResolversByName(dist.name);
  }

  static getResolvers() {
    if (!Distribution.getAsyncResolvers) Distribution.getAsyncResolvers = new Map();
    return Distribution.getAsyncResolvers;
  }

  static getResolversByName(name) {
    let resolvers = Distribution.getResolvers();
    if (resolvers.has(name)) return resolvers.get(name);
    let result = [];
    resolvers.set(name, result);
    return result;
  }

  static getAsync(name) {
    return new Promise(async function (_resolve, _reject) {
      let result = Distribution.getAll().get(name);

      if (result) {
        _resolve(result);

        return;
      }

      Distribution.getResolversByName(name).push(_resolve);
    });
  }

  static clearResolversByName(name) {
    let resolvers = Distribution.getResolversByName(name);
    resolvers.length = 0;
  }

}

function log(...msgs) {
  console.log("[qtanr]", ...msgs);
} // function buildAsync (info: QtanrJson): Promise<void|number> {
//   return new Promise(async (_resolve, _reject)=>{
//     let dist = await Distribution.getAsync(info.distribution);
//     log(`Building w/ distro ${dist.iso} . . .`);
//     // dist.iso
//     _resolve();
//   });
// }


function build(info) {
  if (!Distribution.has(info.distribution)) {
    log(`Cannot build, distro ${info.distribution} is not present!`);
  }
}

async function main() {
  log("initializing");
  build({
    distribution: "arch-x86_64"
  });
  log("done");
}

main();