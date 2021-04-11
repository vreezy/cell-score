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
      case "3":
         $url = "http://161.97.93.182:5000/zone3/";
         break;
      case "4":
         $url = "http://161.97.93.182:5000/zone4/";
         break;
      case "tgUpdate":
        $url = "http://161.97.93.182:5000/tgUpdate/";
        break;
      default:
         $url = "http://161.97.93.182:5000/zone1/";
         break;
   }

   

   $content = file_get_contents($url);
   http_response_code(200);
   
   echo json_encode($content);
} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(
        array("message" => "unknow error")
    );
}

?>