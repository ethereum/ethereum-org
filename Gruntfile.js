var src = 'public/';
var dest = 'dist/';

var app = ['public/js/ether-checker.js', 'public/js/script.js'];

var vendor = [
  'public/js/jquery-1.11.2.min.js',
  'public/js/bootstrap.min.js',
  'public/js/jquery.scrollme.min.js',
  'public/js/bitcoinjs-min.js',
  'public/js/numeral.js',
  'public/js/jquery.tableofcontents.min.js'
];

var styles = ['bootstrap.min.css', 'font-awesome.min.css', 'style.css'];

const mistReleaseURL = () => {
  const token = process.env.GITHUB_TOKEN_RELEASES;
  const baseURL = 'https://api.github.com/repos/ethereum/mist/releases/latest';
  const accessKey = token ? `?access_token=${token}` : '';
  return `${baseURL}${accessKey}`;
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    http: {
      fetch_mist_releases: {
        options: {
          headers: {
            'User-Agent': 'Ethereum.org-Gruntfile'
          },
          url: mistReleaseURL()
        },
        dest: 'data/mist_releases.json'
      }
    },
    clean: {
      build: ['dist'],
      cleanup_js: ['dist/js/*.*', '!dist/js/app.*'],
      cleanup_css: ['dist/css/*.css', '!dist/css/app.*.css']
    },
    pug: {
      build: {
        options: {
          data: function(dest, src) {
            var mistRelease = grunt.file
              .readJSON('data/mist_releases.json')
              ['assets'].filter(e => /Ethereum-Wallet/.test(e.name));
            var mistReleaseOSX, mistReleaseWin64, mistReleaseWin32;

            for (var i = 0; i < mistRelease.length; i++) {
              var obj = mistRelease[i];

              if (obj['name'].indexOf('macosx') !== -1) {
                mistReleaseOSX = obj['browser_download_url'];
              } else if (obj['name'].indexOf('win64') !== -1) {
                mistReleaseWin64 = obj['browser_download_url'];
              } else if (obj['name'].indexOf('win32') !== -1) {
                mistReleaseWin32 = obj['browser_download_url'];
              }
            }

            return {
              debug: false,
              pretty: false,
              block: {
                hash: '<%= pkg.hash %>'
              },
              mistReleaseOSX: mistReleaseOSX,
              mistReleaseWin64: mistReleaseWin64,
              mistReleaseWin32: mistReleaseWin32
            };
          }
        },
        files: [
          {
            'dist/index.html': 'views/index.pug'
          },
          {
            'dist/agreement.html': 'views/agreement.pug'
          },
          {
            'dist/crowdsale.html': 'views/crowdsale.pug'
          },
          {
            'dist/dao.html': 'views/dao.pug'
          },
          {
            'dist/ether.html': 'views/ether.pug'
          },
          {
            'dist/cli.html': 'views/cli.pug'
          },
          {
            'dist/greeter.html': 'views/greeter.pug'
          },
          {
            'dist/assets.html': 'views/assets.pug'
          },
          {
            'dist/sale.html': 'views/sale.pug'
          },
          {
            'dist/token.html': 'views/token.pug'
          },
          {
            'dist/brand.html': 'views/brand.pug'
          },
          {
            'dist/foundation.html': 'views/foundation.pug'
          },
          {
            'dist/donate.html': 'views/donate.pug'
          },
          {
            'dist/devgrants.html': 'views/devgrants.pug'
          },
          {
            'dist/privacy-policy.html': 'views/privacy-policy.pug'
          },
          {
            'dist/cookie-policy.html': 'views/cookie-policy.pug'
          },
          {
            'dist/terms-of-use.html': 'views/terms-of-use.pug'
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
        files: [
          {
            expand: true,
            cwd: 'dist/css',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/css/'
          }
        ]
      }
    },
    concat: {
      vendor: {
        src: vendor,
        dest: 'dist/js/vendor.js'
      },
      app: {
        options: {
          separator: ';'
        },
        src: app,
        dest: 'dist/js/app.js'
      },
      js: {
        options: {
          sourceMap: true
        },
        src: ['<%= uglify.vendor.dest %>', '<%= uglify.app.dest %>'],
        dest: 'dist/js/app.min.js'
      },
      css: {
        src: ['dist/css/*.min.css', 'dist/css/*.css'],
        dest: 'dist/css/app.min.css'
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
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-http');

  grunt.registerTask('default', [
    'http',
    'clean',
    'pug',
    'copy',
    'cssmin',
    'concat:vendor',
    'concat:app',
    'uglify',
    'concat:js',
    'concat:css',
    'clean:cleanup_js',
    'clean:cleanup_css'
  ]);
  grunt.registerTask('build', 'default');
};
