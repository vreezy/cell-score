<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

try {
   $zone = htmlspecialchars($_GET["zone"]);
   switch($zone) {
      case "2":
         $url = "http://161.97.93.182:5000/zone2/";
         break;
      default:
         $url = "http://161.97.93.182:5000/zone1/";
         break;
   }

   

   $content = file_get_contents($url);
   http_response_code(200);
   
   echo json_encode($content);
} catch (Any $e) {
    http_response_code(503);
    echo json_encode(
        array("message" => "unknow error")
    );
}

?>