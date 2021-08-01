
interface DistributionJson {
  name: string;
  iso: string;
}

interface QtanrJson {
  distribution: string;
  disk: {
    initialFullImage: boolean;
  }
}

interface BuildInfo {
  workspaceDir: string;
  definition: QtanrJson;
}

type AllDistributions = Map<string, DistributionJson>;

type DistributionResolver = (value: DistributionJson)=>void;
type DistributionResolvers = Array<DistributionResolver>;
type DistributionGetAsyncResolvers = Map<string, DistributionResolvers>;

class Distribution {
  private static all: AllDistributions;
  private static getAsyncResolvers: DistributionGetAsyncResolvers;

  static getAll (): AllDistributions {
    if (!Distribution.all) Distribution.all = new Map();
    return Distribution.all;
  }

  static get (name: string): DistributionJson {
    return Distribution.getAll().get(name);
  }
  static has (name: string): boolean {
    return Distribution.getAll().has(name);
  }
  static set (dist: DistributionJson) {
    let all = Distribution.getAll();
    
    all.set(dist.name, dist);

    let resolvers = Distribution.getResolversByName(dist.name);
    for (let _resolve of resolvers) {
      _resolve(dist);
    }
    Distribution.clearResolversByName(dist.name);
  }
  static getResolvers (): DistributionGetAsyncResolvers {
    if (!Distribution.getAsyncResolvers) Distribution.getAsyncResolvers = new Map();
    return Distribution.getAsyncResolvers;
  }
  static getResolversByName (name: string): DistributionResolvers {
    let resolvers = Distribution.getResolvers();
    if (resolvers.has(name)) return resolvers.get(name);
    let result = [];
    resolvers.set(name, result);
    return result;
  }
  static getAsync (name: string): Promise<DistributionJson> {
    return new Promise(async (_resolve, _reject)=>{
      let result = Distribution.getAll().get(name);

      if (result) {
        _resolve(result);
        return;
      }

      Distribution.getResolversByName(name).push(_resolve);
    });
  }
  static clearResolversByName (name: string) {
    let resolvers = Distribution.getResolversByName(name);
    resolvers.length = 0;
  }
}

function log (...msgs: any[]) {
  console.log("[qtanr]", ...msgs);
}

// function buildAsync (info: QtanrJson): Promise<void|number> {
//   return new Promise(async (_resolve, _reject)=>{
//     let dist = await Distribution.getAsync(info.distribution);
    
//     log(`Building w/ distro ${dist.iso} . . .`);

//     // dist.iso
//     _resolve();
//   });
// }

function build (info: QtanrJson) {
  if (!Distribution.has(info.distribution)) {
    log(`Cannot build, distro ${info.distribution} is not present!`);
  }
}

async function main () {
  log("initializing");

  build({
    distribution: "arch-x86_64"
  });

  log("done");
}

main();
