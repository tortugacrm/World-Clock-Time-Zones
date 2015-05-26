/*
 * This file is part of the 'World Clock Time Zones Dashlet'.
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
({
    plugins: ['Dashlet'],
        
    initDashlet: function () {		
		this.myStep = 1;
		this.dataloaded = false;
		this.timezones = this.settings.get("timezones") || "-8_NAmerica_SanFrancisco";
		this.clocksize = this.settings.get("clocksize") || 100;
		this.spans = this.settings.get("spans") || 4;
		this.spans = eval(this.spans);
		this.settings.set("timezones", this.timezones);
		this.myTimer = setInterval(function() {
			this.drawClock();
		}.bind(this), 1000);
		
    },

	close: function() {
		clearInterval(this.myTimer);
	},

    refreshclock: function() {
		this.drawClock();
	},
    
    loadData: function (options) {
        this.results = [];
		this.saved = [];
        if (!$.isArray(this.timezones)) this.timezones = this.timezones.split(',');
        var col=0;
        var classSpan = 'span' + this.spans;
        var colMax = 0;
        switch(this.spans) {
			case 1 : colMax = 1; break;
			case 6 : colMax = 2; break;
			case 4 : colMax = 3; break;
			case 3 : colMax = 4; break;
			case 2 : colMax = 6; break;
			case 12 : colMax = 1; break;
		}
        
        for(var i=0; i<this.timezones.length; i++) {
			this.saved[i] = false;
			var a = this.timezones[i].split('_');
			this.results[i] = {};
			var r = this.worldClock(eval(a[0]), a[1]);
			this.results[i].text = '<b>' + a[2].replace('-', ' ') + '</b><br/>' + r.text + '<br/>';
			this.results[i].no = this.cid +(i + 1);
			this.results[i].classdiv = classSpan;
			this.results[i].clocksize = this.clocksize;
			// manage row + span
			col++;
			this.results[i].tag1 = '';
			if (col>=colMax+1) {
				col=1;
				this.results[i].tag1 += '</div>';
			}
			if (col==1) {
				this.results[i].tag1 += '<div class="row-fluid">';
			}

		}
		this.render();
		
		this.dataloaded = true;
    },
    
	// DRAW CLOCK
	drawClock: function() {
		if (!this.dataloaded) {
			console.log('drawClock not ready');
			return;
		}
		
		for(var i=0; i<this.timezones.length; i++) {
			var canvas = document.getElementById("canvas"+this.cid +(i + 1));
			if (canvas != null) {
				var a = this.timezones[i].split('_');
				var r = this.worldClock(eval(a[0]), a[1]);
				var ctx = canvas.getContext("2d");
				if (!this.saved[i]) {
					this.saved[i] = true;
					ctx.save();
				} else {
					ctx.restore();
					ctx.save();
				}
				var radius = canvas.height / 2;
				ctx.translate(radius, radius);
				radius = radius * 0.90;
				this.drawFace(ctx, radius);
				this.drawNumbers(ctx, radius);
				this.drawTime(ctx, radius, r.hour, r.minute, r.second);
			}
		}
	},

	drawFace: function(ctx, radius) {
      var grad;
	  ctx.beginPath();
	  ctx.arc(0, 0, radius, 0, 2*Math.PI);
	  ctx.fillStyle = 'white';
	  ctx.fill();
	  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
	  grad.addColorStop(0, '#333');
	  grad.addColorStop(0.5, 'white');
	  grad.addColorStop(1, '#333');
	  ctx.strokeStyle = grad;
	  ctx.lineWidth = radius*0.1;
	  ctx.stroke();
	  ctx.beginPath();
	  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
	  ctx.fillStyle = '#333';
	  ctx.fill();
	},

	drawNumbers: function(ctx, radius) {
	  var ang;
	  var num;
	  ctx.font = radius*0.15 + "px arial";
	  ctx.textBaseline="middle";
	  ctx.textAlign="center";
	  for(num = 1; num < 13; num++){
		ang = num * Math.PI / 6;
		ctx.rotate(ang);
		ctx.translate(0, -radius*0.85);
		ctx.rotate(-ang);
		ctx.fillText(num.toString(), 0, 0);
		ctx.rotate(ang);
		ctx.translate(0, radius*0.85);
		ctx.rotate(-ang);
	  }
	},

	drawTime: function(ctx, radius, hour, minute, second){
		//hour
		hour=hour%12;
		hour=(hour*Math.PI/6)+
		(minute*Math.PI/(6*60))+
		(second*Math.PI/(360*60));
		this.drawHand(ctx, hour, radius*0.5, radius*0.07);
		//minute
		minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
		this.drawHand(ctx, minute, radius*0.8, radius*0.07);
		// second
		second=(second*Math.PI/30);
		this.drawHand(ctx, second, radius*0.9, radius*0.02);
	},

	drawHand: function(ctx, pos, length, width) {
		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.lineCap = "round";
		ctx.moveTo(0,0);
		ctx.rotate(pos);
		ctx.lineTo(0, -length);
		ctx.stroke();
		ctx.rotate(-pos);
	},	    
    
    
	worldClock: function (zone, region){
		var dst = 0;
		var time = new Date();
		var gmtMS = time.getTime() + (time.getTimezoneOffset() * 60000);
		var gmtTime = new Date(gmtMS);
		var day = gmtTime.getDate();
		var month = gmtTime.getMonth();
		var year = gmtTime.getYear();
		if(year < 1000)	
			year += 1900;
		var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		var monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");
		if (year%4 == 0)
			monthDays = new Array("31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");
		if(year%100 == 0 && year%400 != 0)
			monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");

		var hr = gmtTime.getHours() + zone;
		var min = gmtTime.getMinutes();
		var sec = gmtTime.getSeconds();

		if (hr >= 24){
			hr = hr-24;
			day -= -1;
		}
		if (hr < 0){
			hr -= -24;
			day -= 1;
		}
		if (hr < 10)
			hr = " " + hr;
		if (min < 10)
			min = "0" + min;
		if (sec < 10)
			sec = "0" + sec;
		if (day <= 0){
			if (month == 0){
				month = 11;
				year -= 1;
			}
			else
				month -= 1;
			day = monthDays[month];
		}
		if(day > monthDays[month]){
			day = 1;
			if(month == 11){
				month = 0;
				year -= -1;
			}
			else
			month -= -1;
		}
		if (region == "NAmerica"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(3);
			startDST.setHours(2);
			startDST.setDate(1);
			var dayDST = startDST.getDay();
			if (dayDST != 0){
				startDST.setDate(8-dayDST);
				}
				else{
				startDST.setDate(1);
				}
			endDST.setMonth(9);
			endDST.setHours(1);
			endDST.setDate(31);
			dayDST = endDST.getDay();
			endDST.setDate(31-dayDST);
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST && currentTime < endDST){
				dst = 1;
				}
		}
		if (region == "Europe"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(2);
			startDST.setHours(1);
			startDST.setDate(31);
			var dayDST = startDST.getDay();
			startDST.setDate(31-dayDST);
			endDST.setMonth(9);
			endDST.setHours(0);
			endDST.setDate(31);
			dayDST = endDST.getDay();
			endDST.setDate(31-dayDST);
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST && currentTime < endDST){
				dst = 1;
				}
		}

		if (region == "SAmerica"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(9);
			startDST.setHours(0);
			startDST.setDate(1);
			var dayDST = startDST.getDay();
			if (dayDST != 0){
				startDST.setDate(22-dayDST);
				}
				else{
				startDST.setDate(15);
				}
			endDST.setMonth(1);
			endDST.setHours(11);
			endDST.setDate(1);
			dayDST = endDST.getDay();
			if (dayDST != 0){
				endDST.setDate(21-dayDST);
				}
				else{
				endDST.setDate(14);
				}
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST || currentTime < endDST){
				dst = 1;
				}
		}
		if (region == "Cairo"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(3);
			startDST.setHours(0);
			startDST.setDate(30);
			var dayDST = startDST.getDay();
			if (dayDST < 5){
				startDST.setDate(28-dayDST);
				}
				else {
				startDST.setDate(35-dayDST);
				}
			endDST.setMonth(8);
			endDST.setHours(11);
			endDST.setDate(30);
			dayDST = endDST.getDay();
			if (dayDST < 4){
				endDST.setDate(27-dayDST);
				}
				else{
				endDST.setDate(34-dayDST);
				}
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST && currentTime < endDST){
				dst = 1;
				}
		}
		if (region == "Israel"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(3);
			startDST.setHours(2);
			startDST.setDate(1);
			endDST.setMonth(8);
			endDST.setHours(2);
			endDST.setDate(25);
			dayDST = endDST.getDay();
			if (dayDST != 0){
			endDST.setDate(32-dayDST);
			}
			else{
			endDST.setDate(1);
			endDST.setMonth(9);
			}
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST && currentTime < endDST){
				dst = 1;
				}
		}
		if (region == "Beirut"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(2);
			startDST.setHours(0);
			startDST.setDate(31);
			var dayDST = startDST.getDay();
			startDST.setDate(31-dayDST);
			endDST.setMonth(9);
			endDST.setHours(11);
			endDST.setDate(31);
			dayDST = endDST.getDay();
			endDST.setDate(30-dayDST);
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST && currentTime < endDST){
				dst = 1;
				}
		}
		if (region == "Baghdad"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(3);
			startDST.setHours(3);
			startDST.setDate(1);
			endDST.setMonth(9);
			endDST.setHours(3);
			endDST.setDate(1);
			dayDST = endDST.getDay();
				var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST && currentTime < endDST){
				dst = 1;
				}
		}
		if (region == "Australia"){
			var startDST = new Date();
			var endDST = new Date();
			startDST.setMonth(9);
			startDST.setHours(2);
			startDST.setDate(31);
			var dayDST = startDST.getDay();
			startDST.setDate(31-dayDST);
			endDST.setMonth(2);
			endDST.setHours(2);
			endDST.setDate(31);
			dayDST = endDST.getDay();
			endDST.setDate(31-dayDST);
			var currentTime = new Date();
			currentTime.setMonth(month);
			currentTime.setYear(year);
			currentTime.setDate(day);
			currentTime.setHours(hr);
			if(currentTime >= startDST || currentTime < endDST){
				dst = 1;
				}
		}

		var r = {};
		
		if (dst == 1){
			hr -= -1;
			if (hr >= 24){
			hr = hr-24;
			day -= -1;
			}
			if (hr < 10){
			hr = " " + hr;
			}
			if(day > monthDays[month]){
			day = 1;
			if(month == 11){
			month = 0;
			year -= -1;
			}
			else{
			month -= -1;
			}
			}
		r.text = monthArray[month] + " " + day + ", " + year + "<br />" + hr + ":" + min + ":" + sec + " DST";
		}
		else{
		r.text = monthArray[month] + " " + day + ", " + year + "<br />" + hr + ":" + min + ":" + sec;
		}
		r.hour = hr;
		r.minute = min;
		r.second = sec;
		return r;
	}
    
})
