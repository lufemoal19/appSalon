<?php

function obtenerServicios() : array{
    try {
        //code...

        // Importar una conexion
        require 'database.php';

        //var_dump($data_base);

        // Escribir codigo SQL
        $sql = "SELECT * FROM servicios;";
        
        $consulta = mysqli_query($data_base,$sql);
        
        // Arreglo vacio
        $servicios = [];
        $i = 0;
        // Obtener los resultados
        //  echo "<pre>";
        //  var_dump(mysqli_fetch_assoc($consulta));
        //  echo "</pre>";

        while($row = mysqli_fetch_assoc($consulta)){
            //$servicios[] = $row;
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];
            $i++;
        }


        return $servicios;

    } catch (\Throwable $th) {
        //throw $th;

        var_dump($th);

    }
}

?>