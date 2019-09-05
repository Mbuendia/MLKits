let outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}


function runAnalysis() {
  // cantidad de iteraciones que se hacem
  const testSetSize = 300;
  // destructuring de la division de los arrays que se recogen en la web
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  //funcion de lodash que hace un array de los numeros que se pongan (solucion pija para un for de toda la vida)
  _.range(1, 40).forEach(k => {

    //se hacen varios test para ver el porcentaje de accierto del algoritmo
    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[0], k) === testPoint[3])
    .size()
    .divide(testSetSize)
    .value();

   console.log('For k of', k, ' Accuracy:', Math.floor(accuracy*100));
});
  

 
}

/* 
* * Algoritmo KNN (K vencinos mas proximos, metodo de clasificacion supervisada)
! usamos lodash para realizar los bucles pero no es necesario
*/
function knn(data, point, k) {
  //1. Ejecutamos un conjunto de operacion en lodash con chain(array) ej: [[300, .5, 16, 1], [140, .5, 16, 2], [250, .5, 16, 4], [290, .5, 16, 4]]
  //2. hacemos un map donde la funcion hace que devuelva un array con la distancia entre la posicion de caida de la pelota y el cubo donde cae ej: [[300, 1], [140, 2], [250, 4], [290,  4]]
  //3. ordenacion por los puntos de caida desde los mas cercanos a 0 a los mas lejanos ej: [[140, 2], [250, 4], [290, 4], [300, 1]]
  //4. divide el array entre 0 y los K (un numero que nosotros indicamos que son cercanos al que se ha tirado, es decir  si ponemos 2 seran los 2 numeros mas cercanos a Point) ej: [[250, 4],  [290, 4], [300, 1]]
  //5. cuenta los array y en que cubo cae ej: {["4": 2], ["1": 1]} (ojo lo devuelve en objeto)
  //6. agrupa los que son iguales y los convierte en array si entra un objeto. es decir si ha caido en el bucket 4 y hay 5 array iguales. Los agrupa ej: [["4": 2], ["1": 1]]
  //7. ordena por cantidad de repeticiones ej: [["1": 1], ["4": 2]]
  //8. se coge el ultimo valor array (padre) ej: ["4": 2]
  //9. se coge el primer valor del array ej: "4"
  //10. lo parsea a numero ej: 4
  //11. termina el conjunto de operaciones value()
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

//la distancia entre un punto a en un diagrma en 2 dimensiones (X, Y) donde X es el pnto donde se suelta la pelota(linear) e Y el cubo donde llega (del 1 al 10(discreto))
//TODO: Continuacion de la siguiente parte del curso, seccion 2
function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

//shuffle es barajar, lo que hace esta funcion es poner de forma aleatoria los numeros de el array que se pasa,
//esto se hace para separar de forma aleatoria los datos que se han recogido desde el index y entonces tenemos los datos training y los datos de test (algoritmo KNN)
function splitDataset(data, testCount) {
  //se pone los datos de array padre de forma aleatoria 
  const shuffled = _.shuffle(data);

  //se hace un slice de los datos aleatorios y se divide en 2 variables y se devuelven
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];

}