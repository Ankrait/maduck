<?php

function translit($value)
{
  $converter = array(
    'а' => 'a',
    'б' => 'b',
    'в' => 'v',
    'г' => 'g',
    'д' => 'd',
    'е' => 'e',
    'ё' => 'e',
    'ж' => 'zh',
    'з' => 'z',
    'и' => 'i',
    'й' => 'y',
    'к' => 'k',
    'л' => 'l',
    'м' => 'm',
    'н' => 'n',
    'о' => 'o',
    'п' => 'p',
    'р' => 'r',
    'с' => 's',
    'т' => 't',
    'у' => 'u',
    'ф' => 'f',
    'х' => 'h',
    'ц' => 'c',
    'ч' => 'ch',
    'ш' => 'sh',
    'щ' => 'sch',
    'ь' => '',
    'ы' => 'y',
    'ъ' => '',
    'э' => 'e',
    'ю' => 'yu',
    'я' => 'ya',

    'А' => 'A',
    'Б' => 'B',
    'В' => 'V',
    'Г' => 'G',
    'Д' => 'D',
    'Е' => 'E',
    'Ё' => 'E',
    'Ж' => 'Zh',
    'З' => 'Z',
    'И' => 'I',
    'Й' => 'Y',
    'К' => 'K',
    'Л' => 'L',
    'М' => 'M',
    'Н' => 'N',
    'О' => 'O',
    'П' => 'P',
    'Р' => 'R',
    'С' => 'S',
    'Т' => 'T',
    'У' => 'U',
    'Ф' => 'F',
    'Х' => 'H',
    'Ц' => 'C',
    'Ч' => 'Ch',
    'Ш' => 'Sh',
    'Щ' => 'Sch',
    'Ь' => '',
    'Ы' => 'Y',
    'Ъ' => '',
    'Э' => 'E',
    'Ю' => 'Yu',
    'Я' => 'Ya',
  );

  $value = strtr($value, $converter);
  return $value;
}

// Токен
const TOKEN = '5489297780:AAFKxXGkodq8omvyJMhDU-htTxfe4S_sAeU';
// ID чата
const CHATID = '156045434'; //-991500808
// Массив допустимых значений типа файла. Популярные типы файлов можно посмотреть тут: https://docs.w3cub.com/http/basics_of_http/mime_types/complete_list_of_mime_types
$types = array('text/plain', 'image/png', 'image/jpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword');
// Максимальный размер файла в килобайтах
// 1048576; // 1 МБ
$size = 31457280; // 30 МБ



if ($_SERVER["REQUEST_METHOD"] != "POST") {
  header("Location: /");
  die();
}

// Проверяем не пусты ли поля с именем и телефоном
if (empty($_POST['Name']) || empty($_POST['Phone'])) {
  header($_SERVER["SERVER_PROTOCOL"] . " 400 Введите имя и телефон");
  die();
}

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

$textSendStatus = file_get_contents('https://api.telegram.org/bot' . TOKEN . '/sendMessage?chat_id=' . CHATID . '&parse_mode=html&text=' . $txt);

if (isset(json_decode($textSendStatus)->{'ok'}) && json_decode($textSendStatus)->{'ok'}) {
  if (empty($_FILES['files']['tmp_name'])) {
    header($_SERVER["SERVER_PROTOCOL"] . " 200 Данные отправлены");
    die();
  }

  $urlFile = "https://api.telegram.org/bot" . TOKEN . "/sendMediaGroup";

  // Путь загрузки файлов
  $path = $_SERVER['DOCUMENT_ROOT'] . '/tmp/';

  // Загрузка файла и вывод сообщения
  $mediaData = [];
  $postContent = [
    'chat_id' => CHATID,
  ];

  for ($ct = 0; $ct < count($_FILES['files']['tmp_name']); $ct++) {
    $filename = translit($_FILES['files']['name'][$ct]);
    if ($_FILES['files']['name'][$ct] && @copy($_FILES['files']['tmp_name'][$ct], $path . $filename)) {
      if ($_FILES['files']['size'][$ct] < $size && in_array($_FILES['files']['type'][$ct], $types)) {
        $filePath = $path . $filename;
        $postContent[$filename] = new CURLFile(realpath($filePath));
        $mediaData[] = ['type' => 'document', 'media' => 'attach://' . $filename];
      }
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

  if (isset(json_decode($fileSendStatus)->{'ok'}) && json_decode($fileSendStatus)->{'ok'}) {
    header($_SERVER["SERVER_PROTOCOL"] . " 200 Данные отправлены.");
    die();
  }

  header($_SERVER["SERVER_PROTOCOL"] . " 201 Данные отправлены. Ошибка отправки файла.");
  die();
}

header($_SERVER["SERVER_PROTOCOL"] . " 400 Ошибка сервера");
