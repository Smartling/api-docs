const yaml = require('js-yaml');
const fs = require('fs');
const { Resolver }  = require('@stoplight/json-ref-resolver');
const { join } = require('@stoplight/path')

try {
    const makeResultForCertainFileFunction = async (sourceFilePath, destinationFilePath, baseFilePath) => {
        // Get document, or throw exception on error
        console.log("-----------------------------------------------------------");
        console.log("process sourceFilePath=" + sourceFilePath);
        const doc = yaml.load(fs.readFileSync(sourceFilePath, 'utf8'));
        const resolver = new Resolver({
            // resolvers can do anything, so long as they define an async read function that resolves to a value
            resolvers: {
                // this resolver will be invoked for refs with the file protocol
                baseURI: baseFilePath,
                file: {
                    resolve(ref) {
                        console.log("before resolve ref");
                        console.log(ref);
                        const docUri = join(baseFilePath, ref.toString());
                        return yaml.load(fs.readFileSync(docUri, 'utf8'));
                    }
                }
            }
        });
        console.log("-----------------------------------------------------------");
        console.log("before resolver.resolve(..)");
        const resolved = await resolver.resolve(doc, { jsonPointer: "#/x-paths" });
        console.log("after resolver.resolve(..)");
        console.log("-----------------------------------------------------------");
        console.log(resolved);
        console.log("before resolved.result");
        var destinationJson = {"x-paths": resolved.result}
        fs.writeFileSync(destinationFilePath, yaml.dump(destinationJson));
        console.log("after resolved.result");
        console.log("processed sourceFilePath=" + sourceFilePath);
        console.log("-----------------------------------------------------------");
    }

    const makeResultFunction = async() => {
        await makeResultForCertainFileFunction("./spec/translation_quality/dictionaries.yaml", "./spec/translation_quality/dictionaries_result.yaml", "./spec/translation_quality");
        await makeResultForCertainFileFunction("./spec/translation_quality/profiles.yaml", "./spec/translation_quality/profiles_result.yaml", "./spec/translation_quality");
        await makeResultForCertainFileFunction("./spec/translation_quality/checks/accounts.yaml", "./spec/translation_quality/checks/accounts_result.yaml", "./spec/translation_quality/checks");
        await makeResultForCertainFileFunction("./spec/translation_quality/check_type_severity_level.yaml", "./spec/translation_quality/check_type_severity_level_result.yaml", "./spec/translation_quality");
        await makeResultForCertainFileFunction("./spec/translation_quality/account_settings.yaml", "./spec/translation_quality/account_settings_result.yaml", "./spec/translation_quality");
        await makeResultForCertainFileFunction("./spec/translation_quality/tqc_check.yaml", "./spec/translation_quality/tqc_check_result.yaml", "./spec/translation_quality");
    }
    makeResultFunction();

} catch (e) {
    console.log(e);
}
