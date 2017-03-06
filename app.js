var legendaryApp = {};

legendaryApp.key = "23cef05e-21d7-464d-bc92-6294665c2f53";
baseApiUrl = "https://global.api.pvp.net";

legendaryApp.init = function(){
legendaryApp.getChamps();
}
legendaryApp.getChamps = function(){
	var champAjax = $.ajax({
		url:baseApiUrl+'/api/lol/static-data/na/v1.2/champion',
		method:'GET',
		dataType: 'json',
		data:{
			api_key: legendaryApp.key,
			champData: 'all'
		}
	});
	$.when(champAjax).done(function(response){
		var rawArray = [];
		for (champ in response.data) {
			rawArray.push(response.data[champ]);
		}
		var blah = rawArray.map(function(item){
			return item;
		}).sort(function(a,b){
			return a.name - b.name
		})
		var alphArray = _.sortBy(rawArray, "name");
		legendaryApp.champsArray = alphArray;
		legendaryApp.showChampList();
		legendaryApp.events();
	})
};
legendaryApp.showChampList = function(){
	$('#search').val('');

	legendaryApp.champsArray.forEach(function(champ){
		var arrayIndex = champ;
		var sprite = champ.image.full;
		var id = champ.id;
		var key = champ.key;
		var name = champ.name;
		var title = champ.title;
		var image = champ.skins[0].num;
		var spriteEl = $(`<img class="champSprite content" alt="${name}">`).attr("src","http://ddragon.leagueoflegends.com/cdn/7.4.3/img/champion/"+sprite);
		var nameEl = $('<h1 class="champName">').text(name);
		var titleEl = $('<h3 class="champTitle">').text(title);
		var headerEl = $('<div class="champHeader">').append(nameEl, titleEl);
		var imageEl = $('<img class="champBlock">').css("background-image","url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+name+"_"+image+".jpg)")
		var champItem = $(`<div class="champItem listIconRatio animated">`).append(spriteEl).attr({"id":id, "data-name":name,key});
		// ).attr({"data-test-1": num1, "data-test-2": num2});
		$('#champList').append(champItem.fadeIn('slow'));
	})
};
legendaryApp.showChampPage = function(){
	$('#search').val('');
	$('#champPage').empty();
	$('#champList').fadeOut('fast');
	let check = 0;
	legendaryApp.fighters.forEach(function(champ){
		// $('#champList > *').animate({opacity: 0 }, 'slow')
		// Usable Champ Info
		var sprite = champ.image.full;
		var id = champ.id;
		var key = champ.key;
		var name = champ.name;
		var title = champ.title;
		var bgImage = champ.skins[0].num;
		//stats
		var attackVal = Math.round(champ.stats.attackdamage);
		var aspeedVal = ((0.625 / (1 + champ.stats.attackspeedoffset))*100).toFixed(2);//number of attacks per second +0.625
		var hpVal = Math.round(champ.stats.hp);
		var movespeedVal = (((champ.stats.movespeed-300) / 10)*3).toFixed(1);
		//HTML Creation
		// set sprite icon
		var spriteEl = $('<img class="champSprite content">').attr("src","http://ddragon.leagueoflegends.com/cdn/7.4.3/img/champion/"+sprite);
		//set name in h1
		var nameEl = $('<h1 class="champName">').text(name);
		// set title
		var titleEl = $('<h3 class="champTitle">').text(title);
		//display stats
		var statAttackEl = $('<div class="stat ">').html(`DAMAGE<p class="attack">${attackVal}</p>`);
		var statAspeedEl = $('<div class="stat ">').html(`SPEED<p class="aspeed">${aspeedVal}</p>`);
		var statHpEl = $('<div class="stat ">').html(`HEALTH<p class="hp">${hpVal}</p>`);
		var statmovespeedEl = $('<div class="stat ">').html(`DODGE<p class="movespeed">${movespeedVal}%</p>`);
		var headerTextEl = $('<div class="champHeaderText">').append(nameEl, titleEl);
		var headerEl = $('<div class="headerBlock">').append(spriteEl,headerTextEl);
		var contentEl = $('<div class="champStats">').append(statAttackEl,statHpEl,statAspeedEl,statmovespeedEl);
		var champBlock = $('<div class="champBlock animated flipInX">').append(headerEl,contentEl).css("background-image","url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+key+"_"+bgImage+".jpg)");
		var champPage = $('#champPage').append(champBlock);
		$('#champPage').append(champBlock);
		$('#champPage').fadeIn('slow');
		// let fightBtn = $()
		check++;
		if (check === 1){
			$('#champPage').append(champBlock);
			$('#champPage').append(`<div class="bContainer"></div>`)
			$('.bContainer').append(`<input type='submit' id="fight" value="fight" class="animated fadeInBig">`);
			$('.bContainer').append(`<input type='submit' id="back" value="back" class="animated fadeInBig">`);

		}
	})
	if (check === 2){
		$('#champPage').append(`<ul id="battlelog" class="animated fadeInBig"></ul>`);
		legendaryApp.clickFight();
	}
};
legendaryApp.openList = function(){
	$('header').on('click', function(){
		console.log('click')

		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		$('.champItem').removeClass("fighter-selected infinite");
		legendaryApp.fighters = [];		
	});

	$('#clear').on('click', function(){
		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		$('.champItem').removeClass("fighter-selected bounce infinite");
		legendaryApp.fighters = [];
	});
};
legendaryApp.clickListItem = function(){
	legendaryApp.fighters = [];
	$('.champItem').on('click' ,function(){
		$('#search').val('');
		if ($(this).hasClass("fighter-selected")){
			//remove selected item from array
			var getID = $(this).attr("id");
			$(this).removeClass("fighter-selected bounce infinite");
			legendaryApp.fighters = $.grep(legendaryApp.fighters, function(e){ 
			     return e.id != getID; 
			});
		}else{
			if (legendaryApp.fighters.length < 2){
				//If array has less than two entries, add the clicked champion
				var getID = $(this).attr("id");
				var champsArray = legendaryApp.champsArray;
				var filteredItem = champsArray.filter(function(item){
					return item.id === parseInt(getID)
				})
				legendaryApp.fighters.push(filteredItem[0]);
				$(this).toggleClass("fighter-selected bounce infinite");
			}else{
				let prevFighter = legendaryApp.fighters.shift();
				let uncheckedFighter = $('#champList').find('#' +prevFighter.id);
				var getID = $(this).attr("id");
				var champsArray = legendaryApp.champsArray;
				var filteredItem = champsArray.filter(function(item){
					return item.id === parseInt(getID)
				})
				legendaryApp.fighters.push(filteredItem[0]);
				uncheckedFighter.toggleClass("fighter-selected bounce infinite");
				$(this).toggleClass("fighter-selected bounce infinite");
			}
		}
	});
};
legendaryApp.fight = function(){
	legendaryApp.fightTimer = 3;
	let winner = "";
	if (legendaryApp.fighters.length === 2){

	//both attack, lower enemy health
		let fighter1 = legendaryApp.fighters[0];
		let attackVal1 = Math.round(fighter1.stats.attackdamage);
		let aspeedVal1 = ((0.625 / (1 + fighter1.stats.attackspeedoffset))*100).toFixed(2);
		let hpVal1 = Math.round(fighter1.stats.hp);
		let movespeedVal1 = ((fighter1.stats.movespeed-300) / 10)*3;
		let fighter2 = legendaryApp.fighters[1];
		let attackVal2 = Math.round(fighter2.stats.attackdamage);
		let aspeedVal2 = ((0.625 / (1 + fighter2.stats.attackspeedoffset))*100).toFixed(2);
		let hpVal2 = Math.round(fighter2.stats.hp);
		let movespeedVal2 = (((fighter2.stats.movespeed-300) / 10)*3).toFixed(1);
		let accuracy1 = 100 - movespeedVal2;
		let accuracy2 = 100 - movespeedVal1;

		do{
			//fighter1 attack
			if (hpVal1 > 0){
				let accuracy = Math.random() * 100;
				// if a random number 1-100 is smaller than fighter's accuracy, it hits
				// calc 100 - accuracy# = chance to miss
				// e.g. random = 50, accuracy = 88 = hit
				// e.g. random = 90, accuracy = 88 = mis
				if (accuracy < accuracy1){ 
					hpVal2 -= attackVal1;
					if (hpVal2 <= 0){
						hpVal2 = 0;
						winner = fighter1.name;
					}
				   $('#battlelog').append(`<li>${fighter1.name} attacks for <span class="attack">${attackVal1}</span> damage! - ${fighter2.name} has <span class="hp">${hpVal2}</span> HP left!</li>`);
				}else{
					$('#battlelog').append(`<li class="missed">${fighter1.name} missed!</li>`);
				}
			}
			//fighter2 attack
			if (hpVal2 > 0){
				let accuracy = Math.random() * 100;
				if (accuracy < accuracy2){ 
					hpVal1 -= attackVal2;
					if (hpVal1 <= 0){
						hpVal1 = 0;
						winner = fighter2.name;
					}
					$('#battlelog').append(`<li>${fighter2.name} attacks for <span class="attack">${attackVal2}</span> damage! - ${fighter1.name} has <span class="hp">${hpVal1}</span> HP left!</li>`);
				}else{ // 85-99
					$('#battlelog').append(`<li class="missed">${fighter2.name} missed!</li>`);
				}
			}
			if(hpVal1 > 0 && hpVal2 > 0){

			}else{
				$('#battlelog').append(`<li id="winresult" class="winnerLi animated flash">${winner} wins!</li>`);
				$('html, body').animate({scrollTop: $('#battlelog').offset().top},500);
			}
		}while(hpVal1 > 0 && hpVal2 > 0);
	}
};
legendaryApp.clickFight = function(){
	$('#fight').on('click', function(){
		$('#battlelog').empty();
		$('#battlelog').css({"opacity":"1", "height":"100%"})
		legendaryApp.fight();
	});
};
legendaryApp.clearPicks = function(){
	$('#clear').on('click', function(){
		$('#search').val('');
		$('.champItem').removeClass("fighter-selected bounce infinite");
		legendaryApp.fighters = [];
	});
};
legendaryApp.pick = function(){
	$('#pick').on('click', function(){
		$('#search').val('');
		$('.champItem').removeClass("fighter-selected bounce infinite");
		legendaryApp.showChampPage();
	})
};
legendaryApp.filterList = function(){
	//
	$('.champItem').on('click' ,function(){
       var searchText = $(this).val().toLowerCase();
       
       $('#champList .champItem').each(function(){
       	var currentLiText = $(this).attr('data-name').toLowerCase();
       	showCurrentLi = currentLiText.indexOf(searchText) !== -1;
           $(this).toggle(showCurrentLi);
       });
   });
	$('#search').keyup(function(){
       var searchText = $(this).val().toLowerCase();
       
       $('#champList .champItem').each(function(){
       	var currentLiText = $(this).attr('data-name').toLowerCase();
       	showCurrentLi = currentLiText.indexOf(searchText) !== -1;
           $(this).toggle(showCurrentLi);
       });
   });
}
legendaryApp.clickBack = function(){
	$('.bContainer #back').on('click', function(){
		console.log('click')
		
		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		$('.champItem').removeClass("fighter-selected infinite");
		legendaryApp.fighters = [];		
	});
}
legendaryApp.loadChampPage = function(data){
	legendaryApp.showChampPage();
};
legendaryApp.events =  function(){
	legendaryApp.clickListItem();
	legendaryApp.openList();
	legendaryApp.clearPicks();
	legendaryApp.pick();
	legendaryApp.filterList();
	legendaryApp.clickFight();
	legendaryApp.clickBack();
};
$(function(){
	legendaryApp.init();
});
