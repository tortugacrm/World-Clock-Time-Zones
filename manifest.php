<?php
/*
 * This file is part of the 'World Clock Time Zones Dashlet' module.
 * Copyright [2015/5/21] [Olivier Nepomiachty - SugarCRM]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Author: Olivier Nepomiachty SugarCRM
 */


$manifest = array (
  'built_in_version' => '7.5.0.1',
  'acceptable_sugar_versions' => 
  array (
    0 => '',
  ),
  'acceptable_sugar_flavors' => 
  array (
    0 => 'PRO',
    1 => 'ENT',
    2 => 'ULT',
  ),
  'readme' => '',
  'key' => 'WC',
  'author' => 'Olivier Nepomiachty',
  'description' => '',
  'icon' => '',
  'is_uninstallable' => true,
  'name' => 'World Clock Time Zones',
  'published_date' => '2015-05-21 06:00:00',
  'type' => 'module',
  'version' => '1.0.0.1',
  'remove_tables' => 'prompt',
);


$installdefs = array (
  'id' => 'WCTZ_20150521_1',
    
  // ###################
  // copy 
  // ###################
  'copy' => 
  array (
	// view
    0 => 
    array (
      'from' => '<basepath>/custom/clients/base/views/worldclock',
      'to' => 'custom/clients/base/views/worldclock',
    ),
    // language
    1 => 
    array (
      'from' => '<basepath>/language/application/en_us.worldclock.php',
      'to' => 'custom/Extension/application/Ext/Language/en_us.worldclock.php',
    ),

  ),



);
