const { deploy } = require('sftp-sync-deploy')

let config = {
  host: 'kevco.ddns.net', // Required.
  port: 40822, // Optional, Default to 22.
  username: 'kevin', // Required.
  password: 'kevinserver', // Optional.
  localDir: 'dist', // Required, Absolute or relative to cwd.
  remoteDir: '/var/www/html' // Required, Absolute path only.
}

let options = {
  dryRun: false, // Enable dry-run mode. Default to false
  exclude: [ // exclude patterns (glob)
    'node_modules',
    'src/**/*.spec.ts'
  ],
  excludeMode: 'remove', // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
  forceUpload: false // Force uploading all files, Default to false(upload only newer files).
}

deploy(config, options).then(() => {
  console.log('success!')
}).catch(err => {
  console.error('error! ', err)
})
