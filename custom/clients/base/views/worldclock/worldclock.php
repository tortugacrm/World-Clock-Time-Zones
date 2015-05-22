<?php
if(!defined('sugarEntry'))define('sugarEntry', true);


$viewdefs['base']['view']['worldclock'] = array(
    'dashlets' => array(
        array(
            'label' => 'LBL_DASHLETWC_NAME',
            'description' => 'LBL_DASHLETWC_DESC',
            
            'config' => array(
                'timezones' => '-8_NAmerica_San-Francisco,1_Europe_Paris',
            ),

            'preview' => array(
                'timezones' => '-8_NAmerica_San-Francisco',
            ),
            
            'filter' => array(
            ),
            
        ),
    ),
    'config' => array(
        'fields' => array(
            
            array(
                'name' => 'timezones',
                'label' => 'LBL_DASHLETWC_SELECT',
                'type' => 'enum',
                'isMultiSelect' => true,
                'searchBarThreshold' => -1,
                'options' => 'LBL_DASHLETWC_TZ_list',
            ),            

            array(
                'name' => 'spans',
                'label' => 'LBL_DASHLETWC_COLS',
                'type' => 'enum',
                'searchBarThreshold' => 3,
                'options' => array(
					12 => '12',
					2 => '6',
					3 => '4',
					4 => '3',
					6 => '2',
					12 => '1',
                )
            ),            

            array(
                'name' => 'clocksize',
                'label' => 'LBL_DASHLETWC_CLOCKSIZE',
                'type' => 'enum',
                'searchBarThreshold' => 1,
                'options' => array(
					100 => '100',
					150 => '150',
					200 => '200',
					250 => '250',
					300 => '300',
					350 => '350',
					400 => '400',
					450 => '450',
					500 => '500',
                )
            ),  
            
        ),
    ),
);
