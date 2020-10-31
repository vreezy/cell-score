<?php
$content = file_get_contents("http://161.97.93.182:5000/zone1/");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

http_response_code(200);
 
// show products data in json format
echo json_encode($content);

?>

