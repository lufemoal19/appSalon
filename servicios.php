<?php 

require 'includes/functions.php';



$servicios = obtenerServicios();


//$json_servicios = json_encode($servicios, JSON_INVALID_UTF8_SUBSTITUTE);


echo json_encode($servicios, JSON_INVALID_UTF8_SUBSTITUTE);

// echo "<pre>";
// var_dump($json_servicios);
// echo"</pre>";

// echo $json_servicios;


// // echo "<pre>";
// // echo"</pre>";

// echo "<pre>";
// var_dump($servicios);
// echo"</pre>";

?>