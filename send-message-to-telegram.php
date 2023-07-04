<?php

// Токен
const TOKEN = '5489297780:AAFKxXGkodq8omvyJMhDU-htTxfe4S_sAeU';

// ID чата
const CHATID = '-834551687';

// Массив допустимых значений типа файла. Популярные типы файлов можно посмотреть тут: https://docs.w3cub.com/http/basics_of_http/mime_types/complete_list_of_mime_types
$types = array('plain/txt', 'image/png', 'image/jpg', 'application/pdf');

// Максимальный размер файла в килобайтах
// 1048576; // 1 МБ
$size = 1073741824; // 1 ГБ

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  $fileSendStatus = '';
  $textSendStatus = '';
  $msgs = [];

  // Проверяем не пусты ли поля с именем и телефоном
  if (!empty($_POST['Name']) && !empty($_POST['Phone'])) {

    // Если не пустые, то валидируем эти поля и сохраняем и добавляем в тело сообщения. Минимально для теста так:
    $txt = "";

    // Имя
    if (isset($_POST['Name']) && !empty($_POST['Name'])) {
      $txt .= "<b>Имя:</b> " . strip_tags(trim(urlencode($_POST['Name']))) . "%0A";
    }

    // Номер телефона
    if (isset($_POST['Phone']) && !empty($_POST['Phone'])) {
      $txt .= "<b>Телефон:</b> " . strip_tags(trim(urlencode($_POST['Phone']))) . "%0A" . "%0A";
    }

    // описание
    if (isset($_POST['Description']) && !empty($_POST['Description'])) {
      $txt .= "<b>Описание:</b> " . strip_tags(trim(urlencode($_POST['Description']))) . "%0A";
    }

    $textSendStatus = @file_get_contents('https://api.telegram.org/bot' . TOKEN . '/sendMessage?chat_id=' . CHATID . '&parse_mode=html&text=' . $txt);

    if (isset(json_decode($textSendStatus)->{'ok'}) && json_decode($textSendStatus)->{'ok'}) {
      if (!empty($_FILES['File'][0]['tmp_name'])) {

        $urlFile = "https://api.telegram.org/bot" . TOKEN . "/sendMediaGroup?chat_id=" . CHATID;

        // Путь загрузки файлов
        $path = $_SERVER['DOCUMENT_ROOT'] . '/';

        // Загрузка файла и вывод сообщения
        $mediaData = [];
        $postContent = [
          'chat_id' => CHATID,
        ];

        if ($_FILES['File'][0]['name'] && @copy($_FILES['File'][0]['tmp_name'], $path . $_FILES['File'][0]['name'])) {
          if ($_FILES['File'][0]['size'] < $size && in_array($_FILES['File'][0]['type'], $types)) {
            $filePath = $path . $_FILES['File'][0]['name'];
            $postContent[$_FILES['File'][0]['name']] = new CURLFile(realpath($filePath));
            $mediaData[] = ['type' => 'document', 'media' => 'attach://' . $_FILES['File'][0]['name']];
          }
        }

        $postContent['media'] = json_encode($mediaData);

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_HTTPHEADER, ["Content-Type:multipart/form-data"]);
        curl_setopt($curl, CURLOPT_URL, $urlFile);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $postContent);
        $fileSendStatus = curl_exec($curl);
        curl_close($curl);
        $files = glob($path . '*');
        foreach ($files as $file) {
          if (is_file($file))
            unlink($file);
        }
      }
      echo json_encode('SUCCESS');
    } else {
      echo json_encode('ERROR');
      // 
      // echo json_decode($textSendStatus);
    }
  } else {
    echo json_encode('NOTVALID');
  }
} else {
  header("Location: /");
}