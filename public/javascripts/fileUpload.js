const rootStyles = window.getComputedStyle(document.documentElement)
/* get access to styles */


// install plugins
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    imageResizeTargetWidth: 250,
    imageResizeTargetHeight: 250
})

FilePond.parse(document.body); // parsing all file objects into FilePond objects

