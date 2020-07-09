// install plugins
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
); 

FilePond.setOptions({
    imageResizeTargetWidth: 125,
    imageResizeTargetHeight: 125
})

FilePond.parse(document.body); // parsing all file objects into FilePond objects
