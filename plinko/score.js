let outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}


function runAnalysis() {
  const testSetSize = 300;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
_.range(1, 40).forEach(k => {
  const accuracy = _.chain(testSet)
  .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
  .size()
  .divide(testSetSize)
  .value();

   console.log('For k of', k, ' Accuracy:', Math.floor(accuracy*100));
});
  

 
}

function knn(data, point, k) {
  return _.chain(data)
    .map(ball => [distance(ball[0], point), ball[3]])
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}


function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}


function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];

}