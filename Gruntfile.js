var src = 'public/';
var dest = 'dist/';

var app = [
	'public/js/ether-checker.js',
	'public/js/script.js'
];

var vendor = [
	'public/js/jquery-1.11.2.min.js',
	'public/js/bootstrap.min.js',
	'public/js/jquery.scrollme.min.js',
	'public/js/bitcoinjs-min.js',
	'public/js/numeral.js',
	'public/js/jquery.tableofcontents.min.js'
];

var styles = [
	'bootstrap.min.css',
	'font-awesome.css',
	'wicked-grit.css',
	'style.css'
];

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: ['dist'],
			cleanup_js: ['dist/js/*.*', '!dist/js/frontier.*'],
			cleanup_css: ['dist/css/*.css', '!dist/css/frontier.*.css']
		},
		jade: {
			build: {
				options: {
					data: {
						debug: false,
						pretty: false,
						block: {
							hash: '<%= pkg.hash %>'
						}
					}
				},
				files: [
					{
						'dist/index.html': 'views/index.jade'
					},
					{
						'dist/agreement.html': 'views/agreement.jade'
					},
					{
						'dist/crowdsale.html': 'views/crowdsale.jade'
					},
					{
						'dist/dao.html': 'views/dao.jade'
					},
					{
						'dist/ether.html': 'views/ether.jade'
					},
					{
						'dist/cli.html': 'views/cli.jade'
					},
					{
						'dist/greeter.html': 'views/greeter.jade'
					},
					{
						'dist/assets.html': 'views/assets.jade'
					},
					{
						'dist/sale.html': 'views/sale.jade'
					},
					{
						'dist/token.html': 'views/token.jade'
					},
					{
						'dist/brand.html': 'views/brand.jade'
					},
					{
						'dist/foundation.html': 'views/foundation.jade'
					},
					{
						'dist/donate.html': 'views/donate.jade'
					},
					// {
					// 	'dist/swarm.html': 'views/swarm.jade'
					// },
					{
						'dist/4b24096abefbcbb08cb2b482eef4e36.html': 'views/devcon2.jade'
					},
					{
						'dist/devgrants.html': 'views/devgrants.jade'
					}
				]
			}
		},
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'public/fonts/',
						src: ['*.*'],
						dest: 'dist/fonts/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'public/images/',
						src: ['*.ico'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'public/images/',
						src: ['**/*.*'],
						dest: 'dist/images/',
						filter: 'isFile'
					},
					{
						expand: true,
						cwd: 'public/css/',
						src: styles,
						dest: 'dist/css/',
						filter: 'isFile'
					},
					{
						src: 'public/js/jquery-1.11.2.min.map',
						dest: 'dist/js/jquery-1.11.2.min.map'
					}
				]
			}
		},
		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'dist/css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css/'
				}]
			}
		},
		concat: {
			vendor: {
				src: vendor,
				dest: 'dist/js/vendor.js'
			},
			app : {
				options: {
					separator: ';',
				},
				src: app,
				dest: 'dist/js/app.js'
			},
			frontier: {
				options: {
					sourceMap: true
				},
				src: ['<%= uglify.vendor.dest %>', '<%= uglify.app.dest %>'],
				dest: 'dist/js/frontier.min.js'
			},
			css: {
				src: ['dist/css/*.min.css', 'dist/css/*.css'],
				dest: 'dist/css/frontier.min.css'
			}
		},
		uglify: {
			app: {
				dest: 'dist/js/app.min.js',
				src: ['<%= concat.app.dest %>']
			},
			vendor: {
				dest: 'dist/js/vendor.min.js',
				src: ['<%= concat.vendor.dest %>']
			},
			options: {
				mangle: false
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'jade', 'copy', 'cssmin', 'concat:vendor', 'concat:app', 'uglify', 'concat:frontier', 'concat:css', 'clean:cleanup_js', 'clean:cleanup_css']);
	grunt.registerTask('build', 'default');
};
