<?php
date_default_timezone_set('Asia/Manila');
define('CACHE_SALT','v1');
global $mhcache;
$mhcache = new Memcache;
$mhcache->connect("127.0.0.1", 11211);
/**
 * This is the bootstrap file for test application.
 * This file should be removed when the application is deployed for production.
 */

// change the following paths if necessary
$PH_YII_PATH = '/home/odegraciajr/yiifw';
$PH_APP_PATH = $PH_YII_PATH . '/pinoyhumors';

$yii = $PH_YII_PATH . '/framework/yii.php';
$config= $PH_APP_PATH . '/protected/config/main.php';

// remove the following line when in production mode
defined('YII_DEBUG') or define('YII_DEBUG',false);

require_once($yii);
Yii::createWebApplication($config)->run();