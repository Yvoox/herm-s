function csvImportD3(path) {
  d3.csv(path, function(data) {
    console.log(data[0]);
  });
}
