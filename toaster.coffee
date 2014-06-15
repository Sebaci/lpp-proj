# => SRC FOLDER
toast 'src'

  # EXCLUDED FOLDERS (optional)
  # exclude: ['folder/to/exclude', 'another/folder/to/exclude', ... ]

  # => VENDORS (optional)
  vendors: ['vendors/jquery-1.11.1.min.js', 'vendors/underscore-min.js']

  # => OPTIONS (optional, default values listed)
  # bare: false
  # packaging: true
  # expose: ''
  # minify: true

  # => HTTPFOLDER (optional), RELEASE / DEBUG (required)
  httpfolder: 'js'
  release: 'js/app.js'
  debug: 'js/app-debug.js'