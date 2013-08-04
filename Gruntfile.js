
module.exports = function(grunt){
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-concat");

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{ data: grunt.file.readJSON("package.json") }
	);

	grunt.initConfig({
		concat: {
			options: { banner: banner },
			dist: {
				files: {
					"dist/parabox.js": ["src/parabox.js"]
				}
			}
		},
		uglify: {
			options: { banner: banner },
			dist: {
				files: {
					"dist/parabox.min.js": ["src/parabox.js"]
				}
			}
		}
	});

	grunt.registerTask("default", ["concat:dist", "uglify:dist"]);

};