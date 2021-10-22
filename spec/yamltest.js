const yaml = require('js-yaml');
const fs = require('fs');
const { Resolver }  = require('@stoplight/json-ref-resolver');
const { join } = require('@stoplight/path')
//
// import * as fs from "fs";
// import * as yaml from "js-yaml";
// import { Resolver } from "@stoplight/json-ref-resolver";

// Get document, or throw exception on error
try {
    console.log("my test 1");
    // const doc = yaml.load(fs.readFileSync('./spec/example1.yml', 'utf8'));
    // const doc = yaml.load(fs.readFileSync('./spec/translation_quality/tqc_check.yaml', 'utf8'));
    const doc = yaml.load(fs.readFileSync('./spec/translation_quality/dictionaries.yaml', 'utf8'));
    // console.log(doc);
    // console.log(doc.components.schemas.dictionary_checkTypes.get.responses.r200.content.applicationjson.example);

    // const resolver = new Resolver({
    //     // resolvers can do anything, so long as they define an async read function that resolves to a value
    //     resolvers: {
    //         // this resolver will be invoked for refs with the file protocol
    //         file: {
    //             // resolve(ref: uri.URI) {
    //             resolve(ref) {
    //                 console.log(ref);
    //                 return fs.read(String(ref));
    //             }
    //         }
    //     }
    // });
    const baseFilePath  = "./spec/translation_quality";
    const myFunction = async () => {
        // const resolver = new Resolver();
        const resolver = new Resolver({
            // resolvers can do anything, so long as they define an async read function that resolves to a value
            resolvers: {
                // this resolver will be invoked for refs with the file protocol
                baseURI: baseFilePath,
                file: {
                    // resolve(ref: uri.URI) {
                    resolve(ref) {
                        console.log("before resolve 1");
                        console.log(ref);
                        // return fs.read(String(ref));
                        // return fs.readFileSync(ref.toString(), 'utf8');
                        const docUri = join(baseFilePath, ref.toString());
                        return yaml.load(fs.readFileSync(docUri, 'utf8'));
                    }
                }
            }
        });
        console.log("--------------");
        console.log("before resolver.resolve(..)");
        const resolved = await resolver.resolve(doc, {
                    // jsonPointer: "#/components/schemas/dictionary_checkTypes"
                    // jsonPointer: "#/x-paths/tqc_check"
                    jsonPointer: "#/x-paths"
            }
        );
        console.log("--------------");
        // const resolved = await resolver.resolve(
        //     {
        //         user: {
        //             $ref: "#/models/user"
        //         },
        //         models: {
        //             user: {
        //                 name: "john",
        //                 card: {
        //                     $ref: "#/models/card"
        //                 }
        //             },
        //             card: {
        //                 type: "visa"
        //             }
        //         }
        //     },
        //     {
        //         jsonPointer: "#/user"
        //     }
        // );
        console.log("before resolved");
        console.log(resolved);
        console.log("before resolved.result");
        // console.log(resolved.result);
        // console.log(resolved.result.get.responses.r200.content.applicationjson.example);
        // fs.writeFileSync("./spec/example_result.yml", yaml.dump(resolved.result));
        // fs.writeFileSync("./spec/translation_quality/tqc_check_.yaml", yaml.dump(resolved.result));
        fs.writeFileSync("./spec/translation_quality/dictionaries_.yaml", yaml.dump(resolved.result));
    }
    myFunction();
    // myFunction.call();


    // resolver.resolve().then(function(options){
    //     console.log(yaml.stringify(options.openapi));
    // });
    // yaml.loadAll(fs.readFileSync('./spec/example1.yml', 'utf8'), function (doc) {
    //     console.log(doc);
    //     // console.log(doc.components.examples.dictionary_severity_levels_example);
    //     console.log(doc.components.schemas.dictionary_checkTypes.get.responses.r200.content.applicationjson.example);
    // });
} catch (e) {
    console.log(e);
}
