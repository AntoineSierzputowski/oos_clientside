First read guide_description.txt

client-widget/ ├── src/ │ ├── widget.js # Main widget code │ ├── detector.js # Product & stock detection logic │ ├── ui/ │ │ ├── popup.js # Notification popup │ │ └── styles.css # Widget styling │ ├── clients/ # Client-specific implementations │ │
├── base.js # Base detection methods │ │ ├── asics.js # ASICS-specific detection │ │ └── [other-stores].js │ └── api.js # Communication with Microservice A ├── webpack.config.js # For bundling └── package.json
