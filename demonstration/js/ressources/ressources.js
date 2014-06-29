
	/**
	 *	Permet l'initialisation du modal des ressources
	 */
	var initModalRessource = function(){
		var result = new EJS({url: 'js/ressources/template_modal_ressources.ejs'}).render();
		$('#modalNewRessource').html(result);		
	}

	/**
	 *	Permet de définir le modal de la ressource a ajouter/modifier selon le type
	 *	
	 *	@param resId Integer	identifiant de la ressource
	 *	@param type String		type de la ressource
	 *	@param titre String		titre de la ressource
	 *	@param desc String		description de la ressource
	 *	@param url String		url de la ressource
	 *	@param thumbnail String	thumbnail de la ressource
	 */
	var manageRessource = function(resId, type, titre, desc, url, thumbnail, etat, element) {

		if(element){
			titre = escape(element.parents('.infos_ressource').find('#modifTitle input').val());
			desc = escape(element.parents('.infos_ressource').find('#modifDesc textarea').val());;
		}

		afficherModalCreaRess(type, titre, desc, resId, url, thumbnail, etat);

	}


	/**
	 *	Affiche le modal permettant d'ajouter/modifier une ressource
	 *	
	 *	@param num_type Integer	numéro du type de la ressource (défini dans definition.js)
	 *	@param titre String		titre de la ressource
	 *	@param desc String		description de la ressource
	 *	@param resId Integer	identifiant de la ressource
	 *	@param url String		url de la ressource
	 *	@param thumbnail String	thumbnail de la ressource
	 */
	var afficherModalCreaRess = function(num_type, titre, desc, resId, url, thumbnail, etat){

		$('#inputNewRes_title').parent().parent().css("display", "block");
		$('#inputNewRes_desc').parent().parent().css("display", "block");
		// $('#NewRes_motcle').css("display", "block");
		$('#inputNewRes_file').parent().parent().css("display", "block");
		$('#NewRes_img').css("display", "block");

		//Si image
		if (num_type == resType.image){
			$('#NewRes_img').css("display", "none");
		}

		//si nouvelle séquence ou exercice ou nouveau drop externe
		if ((((num_type == resType.sequence)||(num_type == resType.exercice))&&(!resId))||(etat == "new_ext")){

			if(etat != "new_ext"){
				// $('#NewRes_motcle').css("display", "none");
			}
			$('#inputNewRes_file').parent().parent().css("display", "none");

		}
		//Si nouvelle ressource
		else if (etat == "new"){
			// $('#NewRes_motcle').css("display", "none");
		}
		//Si appelé dans le studio
		else if (etat == "studio"){
			$('#resModalLabel').html('Modification de la ressource');
			$('#inputNewRes_file').parent().parent().css("display", "none");
		}
		//Si modification
		else if (!etat){
			$('#resModalLabel').html('Modification de la ressource');
			$('#inputNewRes_title').parent().parent().css("display", "none");
			$('#inputNewRes_desc').parent().parent().css("display", "none");
			$('#inputNewRes_file').parent().parent().css("display", "none");
		}

		//Doublon pour le DOM (attr) et le cache JQuery (data)
		// $('#NewRes_motcle').attr('data-resid', resId).data('resid', resId);
		// afficherTag(resId, '#tagNewRes');

		$('#inputNewRes_title').val(unescape(titre));
		$('#inputNewRes_desc').val(unescape(desc));
		
		//Doublon pour le DOM (attr) et le cache JQuery (data)
		$('#inputNewRes_img').attr('data-thumbnail', thumbnail).data('thumbnail', thumbnail);
		imageSelected(thumbnail, '#inputNewRes_img', num_type);
		
		//Doublon pour le DOM (attr) et le cache JQuery (data)
		$('#creat_new_ressource').attr('data-url', url).data('url', url);
		$('#creat_new_ressource').attr('data-type', num_type).data('type', num_type);
		$('#creat_new_ressource').attr('data-resid', resId).data('resid', resId);

		$('#modalNewRessource').modal('show');

		/* Note : (pour ajout d'une nouvelle modal dans une page):
		*  Il ne faut pas oublier de créer les fonctions :
		*  - Appeler l'ejs template_modal_ressources.ejs
		*  - $('#form_newRessource').submit(function(event){	(pour le submit du formulaire)
		*  - $('#search_modal_input').change(function(event) 	(pour la recherche dans le modal de selection d'image)
		*  - $('#inputNewRes_img').click(function(event) {		(pour le clic sur le bouton de l'ajout d'une image thumbnail)
		*/
    }

	/**
	 *	Sauvegarde la ressource (appelé dans l'EJS des ressources)
	 *
	 *	@param id Integer			identifiant de la ressource
	 *	@param url String			url de la ressource
	 *	@param urlThumbnail String	thumbnail de la ressource
	 *	@param num_type	Integer		numero du type de la ressource (défini dans définitions.js)
	 *	@param element ObjectJS		element dans lequel nous voulons faire la sauvegarde
	 */
	var saveRessourcesByEJS = function(id, url, urlThumbnail, num_type, element){

		var lastTitle = $(element).parent().parent().find('#modifTitle').find('input').data('value');
		var lastDesc = $(element).parent().parent().find('#modifDesc').find('textarea').data('value');		

		var newTitle = $(element).parent().parent().find('#modifTitle').find('input').val();
		var newDesc = $(element).parent().parent().find('#modifDesc').find('textarea').val();

		if((newTitle != lastTitle)||(newDesc != lastDesc)){
			ressourceDefined(id, newTitle, newDesc, url, urlThumbnail, num_type, $(element).parents('.rightBar_ressource'));
		}

		return false;		
	}

	/**
	 *	Définir une ressource
	 *	
	 *	@param id Integer		identifiant de la ressource
	 *	@param title String		titre de la ressource
	 *	@param desc String		description de la ressource
	 *	@param url String		url de la ressource
	 *	@param thumbnail String	thumbnail de la ressource
	 *	@param type Integer	 	numéro du type de la ressource (défini dans definition.js)
	 */
	var ressourceDefined = function(id, title, desc, url, urlThumbnail, type, refreshDisplay){

		var myUrl_Put = cfgWs.prefix+"/platoatic/ressource/" + pseudo + "/VERRU_MODIF/" + id;

		var message;
		message = {
			"action":"modify_ressource", 
			"resType": type, 
			"resTitle": escape(title), 
			"resDesc": escape(desc), 
			"resUrl": url, 
			"resUrlThumbnail": urlThumbnail
		};

		$.ajax({
    		url: myUrl_Put,
    		type: "POST", 
    		dataType: "json", 
    		data: message, 
    		cache: false,
    		timeout: 5000,
    		//crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},

	    	success: function(data) {
	      		console.log ("modifyressource success : type"+type);
	      		if(refreshDisplay!="no"){
		      		$("[data-id='"+id+"']").each(function(){

		      			if($(this).find('.infos_ressource[data-mode=view]').css('display') == "none"){
		      				showDetailModif($(this).data('id'), $(this));
		      			}

		      			var input = {
				    		'data' : data,
				    		'cpt' : 'no',
				    		'mode' : $(this).data('mode'),
				    		'pseudo' : pseudo
				    	};

						var result = new EJS({url: 'js/ressources/template_ressource_list.ejs'}).render(input);
						$(this).html(result);

		      		})
		      		initRessourceDragging("res");
		      	}

	    	},
	    	error: function(jqXHR, textStatus, errorThrown) {
	    	  	console.log(textStatus);
	    	   	console.log(errorThrown);
	    	   	console.log('modifyressource PUT process error');
	    	}
		});
	}

	/**
	 * refreshRessourceCarousel
	 * refresh the corresponding carousel according to the type
	 *
	 **/
	var refreshRessourceCarousel = function(type, refreshDisplay, rendu) {

		var NameTypeRessource = "";

		var searchTagProfil = "";
		if(type==resType.sequence) {
			var checkTags = '#collapseSequence1 .searchTagProfil input';
		}else{ 
			var checkTags = '#collapseRessource1 .searchTagProfil input';
		}
		$(checkTags).each(function(){
			if($(this).is(':checked')){
				searchTagProfil += $(this).data('tag')+" ";	
			}
        })

		//spinningwhell
		if(rendu == "append"){
	    	refreshDisplay.append('<div class="DLRessources">');
		} else {
			refreshDisplay.html('<div class="DLRessources">');
		}

		refreshDisplay.find('.DLRessources').append('<div class="spinningwheel" id="loadRessources"></div>');
		refreshDisplay.find('.DLRessources').append('<div class="spinningwheeltext">Chargement en cours...</div>');
		refreshDisplay.find('#loadRessources').spin();
		//spinningwhell

        if(type==resType.sequence) {

			if(!refreshDisplay.hasClass('liste_sequence_eleve')) {
				afficheMesSequences(pseudo, refreshDisplay, $('#search_seq_field').val(), '', rendu, searchTagProfil);
			} else {
				// afficheAssignedSequence(pseudo, refreshDisplay.parents('.liste_sequence_eleve').data('pseudo'), refreshDisplay.parent());
				afficheAssignedSequence(pseudo, refreshDisplay.data('pseudo'), refreshDisplay);
			}
			return false;
        }
        else if(type==resType.exercice) {

        	NameTypeRessource = "Mes exercices";
			if(!refreshDisplay.hasClass('sequences_detail_res')){
				afficheMesExercices(pseudo, refreshDisplay, $('#search_field').val(), '', rendu, searchTagProfil);
			} else {
				afficheExoSequence(pseudo, refreshDisplay.data('index'), refreshDisplay);
				return false;
			}
		}
		else if(type==resType.fiche) {

			NameTypeRessource = "Mes documents";
			if(!refreshDisplay.hasClass('sequences_detail_res')){
				afficheMesFiches(pseudo, refreshDisplay, $('#search_field').val(), '', rendu, searchTagProfil);
			} else {
				afficheExoSequence(pseudo, refreshDisplay.data('index'), refreshDisplay);
				return false;
			}

		}
		else if(type==resType.image) {

			NameTypeRessource = "Mes images";
			if(!refreshDisplay.hasClass('sequences_detail_res')){
				afficheMesImages(pseudo, refreshDisplay, $('#search_field').val(), '', rendu, searchTagProfil);
			} else {
				afficheExoSequence(pseudo, refreshDisplay.data('index'), refreshDisplay);
				return false;
			}
		}
		else if(type==resType.audio) {

			NameTypeRessource = "Mes audios";
			if(!refreshDisplay.hasClass('sequences_detail_res')){
				afficheMesAudio(pseudo, refreshDisplay, $('#search_field').val(), '', rendu, searchTagProfil);
			} else {
				afficheExoSequence(pseudo, refreshDisplay.data('index'), refreshDisplay);
				return false;
			}
		}
		else if(type==resType.video) {

			NameTypeRessource = "Mes vidéos";
			if(!refreshDisplay.hasClass('sequences_detail_res')){
				afficheMesVideo(pseudo, refreshDisplay, $('#search_field').val(), '', rendu, searchTagProfil);
			} else {
				afficheExoSequence(pseudo, refreshDisplay.data('index'), refreshDisplay);
				return false;
			}
		}

		$('.ressources_ens').find('.NavMenuInterne .brand').html(NameTypeRessource);
		$('.ressources_ens').find('#search_field').attr('data-type', type).data('type', type);
        $('.ressources_ens').find('#creatNewRessource').attr('data-type', type).data('type', type);

	}//end of refreshRessourceCarousel

	/**
	 *	Affiche la liste des tags pour une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param divId Integer	identifiant de la div dans laquelle nous voulons afficher les tags
	 *	@param mode  String 	permet de savoir si on doit afficher ou refresh
	 */
	var afficherTag = function(resId, divId, mode){

    	var myUrl_Get = cfgWs.prefix+"/platoatic/tag/"+resId;

    	$.ajax({
            url: myUrl_Get,
            type: "GET",
            dataType: "json",
            //contentType: "application/json",
           	//crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

            	var owner = $(divId).parents('.NavDetailMenuInterne').prev().data('own');

            	var input = {
		    		'data' : data,
		    		'resId' : resId,
		    		'owner' : owner
		    	};

				// var result = new EJS({url: 'js/ressources/template_tag.ejs'}).render(input);
				// $(divId).html(result);

				if(!mode){
					var result = new EJS({url: 'js/ressources/template_tag.ejs'}).render(input);
					$(divId).html(result);
				} else if (mode == "refresh") {
					var result = new EJS({url: 'js/ressources/template_tag_ressource.ejs'}).render(input);
					$(divId+" .collapseTag_"+resId).html(result);
				}
            		            
           	},
            error: function() {
              console.log('tagDefined POST process error');
              //window.location.href = "./index.html";
            }

        });
    	
    }

    /**
	 *	Refresh des tags d'une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param divId Integer	identifiant de la div dans laquelle nous voulons afficher les tags
	 */
	var refreshTag = function(resId, divId){
		afficherTag(resId, divId, 'refresh');
	}

	/**
	 *	Ajout d'un tag a une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param tag String 		tag à ajouter
	 * 	@parma element Object 	element dans lequel est saisie le tag a ajouter
	 */
	var tagDefined = function(resId, tag, element) {

		if(!tag){
			return false;
		}

		var myUrl_Post = cfgWs.prefix+"/platoatic/tag/"+resId;
        var message = {
        	"resTag": escape(tag)
        };

        $.ajax({
            url: myUrl_Post,
            type: "POST",
            dataType: "json",
            data: message,
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

            	console.log ("tagDefined success");
            	refreshTag(resId, '#ressource_tags[data-index="'+resId+'"] .tags');
            	$(element).val("");
            
           	},
            error: function() {
              console.log('tagDefined POST process error');
              //window.location.href = "./index.html";
            }

        });
	}

	/**
	 *	Suppression d'un tag pour une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param tag String 		tag à supprimer
	 */
	var supprTag = function(resId, tag) {

		var myUrl_Post = cfgWs.prefix+"/platoatic/tag/"+resId;
        var message = {
        	"resTag": tag
        };

        $.ajax({
            url: myUrl_Post,
            type: "DELETE",
            dataType: "json",
            data: message,
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

            	refreshTag(resId, '#ressource_tags[data-index="'+resId+'"] .tags');
            
           	},
            error: function() {
              console.log('tagDefined POST process error');
              //window.location.href = "./index.html";
            }

        });
	}

	/**
	 *	Affichage des compétence d'une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param divId Integer	identifiant de la div dans laquelle nous voulons afficher les compétences
	 *	@param mode  String 	permet de savoir si on doit afficher ou refresh
	 */
	var afficherComp = function(resId, divId, mode){
		
    	var myUrl_Get = cfgWs.prefix+"/platoatic/competency/"+pseudo+"/"+resId;

    	$.ajax({
            url: myUrl_Get,
            type: "GET",
            dataType: "json",
            //contentType: "application/json",
           	//crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

            	var owner = $(divId).parents('.NavDetailMenuInterne').prev().data('own');

            	var input = {
		    		'data' : data,
		    		'resId' : resId,
		    		'owner' : owner
		    	};

		    	if(!mode){
					var result = new EJS({url: 'js/ressources/template_competence.ejs'}).render(input);
					$(divId).html(result);
				} else if (mode == "refresh") {
					var result = new EJS({url: 'js/ressources/template_competence_ressource.ejs'}).render(input);
					$(divId+" .collapseComp_"+resId).html(result);
				}

				typeheadComp();
            		            
           	},
            error: function() {
              console.log('afficherComp POST process error');
              //window.location.href = "./index.html";
            }

        });
	}

	/**
	 *	Refresh des compétence d'une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param divId Integer	identifiant de la div dans laquelle nous voulons afficher les compétences
	 */
	var refreshComp = function(resId, divId){
		afficherComp(resId, divId, 'refresh');
	}

	/**
	 *	Ajout d'une compétence a une ressource
	 *
	 *	@param resId 		Integer		identifiant de la ressources 
	 *	@param competence 	String 		compétence à ajouter
	 */
	var ajoutComp = function(resId, competence) {

		if(!competence){
			return false;
		}

		var myUrl_Post = cfgWs.prefix+"/platoatic/competency/"+pseudo+"/"+resId;
        var message = {
        	"resComp": escape(competence)
        };

        $.ajax({
            url: myUrl_Post,
            type: "POST",
            dataType: "json",
            data: message,
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

            	console.log ("ajoutComp success");
            	refreshComp(resId, '#ressource_competences[data-index="'+resId+'"] .competences');
            	typeheadComp();
            
           	},
            error: function() {
              console.log('ajoutComp POST process error');
              //window.location.href = "./index.html";
            }

        });
	}


	/**
	 *	Modification d'une compétence pour une ressource
	 *
	 *	@param resId 		Integer		identifiant de la ressources 
	 *	@param compId 		Integer 	competence à supprimer
	 */
	var modifComp = function(resId, compId) {

		var element = $(".tablecomp td[data-comp="+compId+"]");
		if(element.find('input').length > 0){

			if(element.data('textcomp') != escape(element.find('input').val())){

				supprComp(resId, compId);
				ajoutComp(resId, element.find('input').val());

			} else {

				var text = element.find('input').val();
				element.html(text);

				element.parent().find('.icon-remove').show();
				element.parent().find('.icon-ok').removeClass('icon-ok').addClass('icon-pencil');

			}

		} else {

			var text = element.html();
			text = $.trim(text);
			element.html('<input type="text" value="'+text.replace(/"/g, '&quot;')+'" style="margin: inherit;"/>');

			element.parent().find('.icon-remove').hide();
			element.parent().find('.icon-pencil').removeClass('icon-pencil').addClass('icon-ok');

		}		

	}

	/**
	 *	Suppression d'une compétence pour une ressource
	 *
	 *	@param resId 	Integer		identifiant de la ressources 
	 *	@param compId 	Integer 	competence à supprimer
	 */
	var supprComp = function(resId, compId) {

		var myUrl_Post = cfgWs.prefix+"/platoatic/competency/"+pseudo+"/"+resId;
        var message = {
        	"compId":compId
        };

        $.ajax({
            url: myUrl_Post,
            type: "DELETE",
            dataType: "json",
            data: message,
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

            	refreshComp(resId, '#ressource_competences[data-index="'+resId+'"] .competences');
            	typeheadComp();
            
           	},
            error: function() {
              console.log('supprComp POST process error');
              //window.location.href = "./index.html";
            }

        });
	}

	/**
	 *	Permet de générer le typehead pour les compétences
	 *
	 *	@param competence 	Array 	tableau des compétences
	 */
	var typeheadComp = function(competence){

		var myUrl_Post = cfgWs.prefix+"/platoatic/competency/"+pseudo;
		var message = "";

		$.ajax({
            url: myUrl_Post,
            type: "GET",
            dataType: "json",
            data: message,
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},
            success: function(data) {

    			var arrayComp = [];
    			var competence = data.listCompProf;

				for (var i = 0; i < competence.length; i++) {
					arrayComp[i] = unescape(competence[i].competency);
				};

				// $('.typeheadComp').typeahead('destroy');

				$('.typeheadComp').each(function(){
					$(this).typeahead({
						items : 6
					}).data('typeahead').source = arrayComp;
				});
            
           	},
            error: function() {
              console.log('supprComp POST process error');
              //window.location.href = "./index.html";
            }

        });

	}

	/**
	 * actionOnRessource
	 * perform the action n a ressource according to its type
	 *
	 **/
	var actionOnRessource = function (type, url, title, bool) {

		console.log("actionOnRessource : " + type);

		if (type==resType.exercice) {
			showExo (url, unescape(title), bool);
		}
		else if (type==resType.audio) {
			playSourceAudio (url, unescape(title));
		}
		else if (type==resType.video) {
			playSourceVideo (url, title);
		}
		else if (type==resType.image) {
			showPicture (url, unescape(title));
		}
		else if (type==resType.fiche) {
			showFiches(url, unescape(title));
		} // end of switch
		else {
			console.log("no action planned");
		}

	} // end of actionOnRessource

	/**
	 *	Permet la visualisation d'une image dans un modal
	 *
	 *	@param strUrl String 	url de la ressource
	 *	@param title String 	titre de la ressource
	 */
	var showPicture = function(strUrl, title) {

		var picTag = $('#pictureSource');
		picTag.attr('src', "/Ressources/images/" + strUrl);
		$("h3", "#pictureModal").html(title);
		$('#pictureModal').modal('show');

		event.preventDefault();
		event.stopPropagation();

	}

	var showExoFromCorrectionModal = function(strUrl, title, correction){
		$('#correctionModal').modal("hide");
		showExo(strUrl, title, correction);
	}

	/**
	 *	Permet la visualisation de l'exercice dans un modal
	 *
	 *	@param strUrl String 	url de la ressource
	 *	@param title String 	titre de la ressource
	 *	@param correction Bool	vrai si pour visualisation de l'exercice enregistré
	 */
	var showExo = function(strUrl, title, correction) {

		var exoTag = $('#svgIframe');
		if(!correction) {
			exoTag.attr('src', UrlRootType.exercice + strUrl + "/index.html");
		}else{
			exoTag.attr('src', UrlRootType.exercice + strUrl);
		}
			
		$("h3", "#exoModal").html(unescape(title));
		$('#exoModal').modal('show');

		var fullscreen = $('#fullscreenExo');
		if(!correction) {
			fullscreen.attr('href', UrlRootType.exercice + strUrl + "/index.html");
		}else{
			fullscreen.attr('href', UrlRootType.exercice + strUrl);
		}

		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 *	Permet la visualisation de la fiche dans un modal
	 *
	 *	@param strUrl String 	url de la ressource
	 *	@param title String 	titre de la ressource
	 */
	var showFiches = function(strUrl, title) {

		window.location.href = UrlRootType.fiche + strUrl;

	}

	var playSourceVideo = function(strUrl, title) {

		window.location.href = UrlRootType.video + strUrl;

	}

	/**
	 *	Permet de jouer une source audio
	 *
	 *	@param strUrl String 	url de la ressource
	 *	@param title String 	titre de la ressource
	 */
	function playSourceAudio (strUrl, title) {

		var audioTag = $('#audioPlayer');
		audioTag.html(null);
		var srcMp3 = document.createElement('source');
		srcMp3.setAttribute('type', "audio/mpeg");
		srcMp3.setAttribute('src', "/Ressources/audios/"+strUrl);

		var srcOgg = document.createElement('source');
		srcOgg.setAttribute('type', "audio/ogg");
		var rootName = strUrl.substr(0, strUrl.lastIndexOf('.')) || strUrl;
		srcOgg.setAttribute('src', "/Ressources/audios/"+ rootName + ".ogg");

		audioTag.append(srcMp3);
		audioTag.append(srcOgg);
		audioTag.append("Your browser does not support the audio tag.");
		audioTag.load();
		$("h3", "#audioModal").html(title);
		$('#audioModal').modal('show');
		audioTag[0].play();
		$('#audioModal').bind('hidden', function (){
			audioTag[0].pause();
		})

		event.stopPropagation();
	}


	var strEsc = function(str) {

		str = str.replace(/'/g, "\\'");
		str = str.replace(/"/g, '\\"');
			return (str);
	}

	//Affiche les images pour le thumbnail d'une ressource
		var imageView = function(filter, Carousel) {

			var myUrl_Get = cfgWs.prefix + "/platoatic/ressources/IMAGES/"+pseudo+"/";

			var search_filter = {
				"search" : escape(filter),
				"searchTag" : '',
                "userSearch" : ($('#modal_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#modal_search_platform:checked').val()=="on"?'true':'false')
			};

			$.ajax({
			    url: myUrl_Get,
			    type: "GET",
			    dataType: "json",
			    data: search_filter,
			    //contentType: "application/json",
			    //crossDomain: true,
		        xhrFields: {
		        	withCredentials : true
		        },	            
			    success: function(data) {

			    	var modalInput = {
			    		"data" : data,
			    		"mode" : "studio",
			    		"display" : Carousel
			    	}

			      	var result = new EJS({url: './js/ressources/template_ressources_carousel.ejs'}).render(modalInput);
			      	$(Carousel).html(result);
					//imgDisplay.html(result);
					//initExternalImgDragging();

			    },
			    error: function() { 
			        console.log('imageView : GET process error ');
			    }
			}); /* end of ajax call */
		} // end of imageView

	//Attacher une ressource à une séquence
		var attachRessourceToSequence = function (noSeq, resId, position, seqDetailDisplay, callback) {

			var myUrl_Put = cfgWs.prefix+"/platoatic/ressource/" + pseudo + "/VERRU_MODIF/" + noSeq;

	        console.log("attachRessourceToSequence [" + myUrl_Put + "] " + resId + " - " + position);

	        var message;
	        message = {
	        	"action":"attach_ressource",  
	        	"resId": resId, 
	        	"position": position
	        };
	        
	        $.ajax({
	            url: myUrl_Put,
	            type: "POST", 
	            dataType: "json", 
	            data: message, 
	            cache: false,
	            timeout: 5000,
	            //crossDomain: true,
          		xhrFields: {
            		withCredentials : true
          		},

	            success: function(data) {
	            	if (callback) callback();
					// $('#sequences_detail_res[data-seqid="'+seqDetailDisplay.data('seqid')+'"]').each(function(){
					// 	afficheExoSequence(pseudo, seqDetailDisplay.data('seqid'), $(this));	
					// })
	           	},
	            error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(textStatus);
	            	console.log(errorThrown);
	              	console.log('attachRessourceToSequence PUT process error');
	            }

	          });

		}; // end of attachRessourceToSequence

	//Détacher une ressource d'une séquence
		var detachRessourceToSequence = function (noSeq, resId, callback) {

			var myUrl_Put = cfgWs.prefix+"/platoatic/ressource/" + pseudo + "/VERRU_MODIF/" + noSeq;

	        console.log("detachRessourceToSequence [" + myUrl_Put + "] " + resId);

	        var message;
	        message = {
	        	"action":"detach_ressource",  
	        	"resId": resId
	        };
	        	        
	        $.ajax({
	            url: myUrl_Put,
	            type: "POST", 
	            dataType: "json", 
	            data: message, 
	            cache: false,
	            timeout: 5000,
	            //crossDomain: true,
          		xhrFields: {
            		withCredentials : true
          		},

	            success: function(data) {
	            	console.log ("modifySequence success : ");
	            	if(callback) callback();
	           	},
	            error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(textStatus);
	            	console.log(errorThrown);
	              	console.log('detachRessourceToSequence PUT process error');
	            }

	          });

		}; // end of detachRessourceToSequence	


	//Supprimer une ressource
		var removeRessource = function(resId, callback) {

			var myUrl_Put = cfgWs.prefix+"/platoatic/ressource/" + pseudo + "/VERRU_DELETE/" + resId;
	        console.log(">> removeRessource[" + resId + "] : " + myUrl_Put); // : " + $('#inputSeqTitle').val());

	        var message = "na";
	        
	        $.ajax({
	            url: myUrl_Put,
	            type: "POST", 
	            dataType: "json", 
	            data: message, 
	            cache: false,
	            timeout: 5000,
	            //crossDomain: true,
          		xhrFields: {
            		withCredentials : true
          		},

	            success: function(data) {
	            	console.log ("removeRessource success : ");
	            	if(callback) callback();
	            },
	            error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(textStatus);
	            	console.log(errorThrown);
	              	console.log('removeRessource process error');
	            }

	          });
		} // end of removeRessource


	//Assigner une ressource
		var createRessourceRelation = function(resId, urlExo, callback) {

			var myUrl_Post = cfgWs.prefix+"/platoatic/ressource/" + pseudo + "/VERRU_MODIF/" + resId;

	        console.log("createRessourceRelation [" + myUrl_Post + "] " + resId + "-" + urlExo);

	        var message;
	        message = {"action":"attach_exo_ressources",  "resId": resId, "resUrl": urlExo};
	        
	        $.ajax({
	            url: myUrl_Post,
	            type: "POST", 
	            dataType: "json", 
	            data: message, 
	            cache: false,
	            timeout: 5000,
	            //crossDomain: true,
          		xhrFields: {
            		withCredentials : true
          		},

	            success: function(data) {
	            	console.log ("modifySequence success : ");
	            	
	            	var result = "success";
	              	callback(result);
	           	},
	            error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(textStatus);
	            	console.log(errorThrown);
	              	console.log('createRessourceRelation POST process error');

					var result = "success";
	              	callback(result);

	            }

	          });
		} // end of createRessourceRelation

	//Décompte le nombre de caractères pour un champ
		var decompte = function(champ, max, classe){
		   var iLongueur, iLongueurRestante;
		   iLongueur = $('#'+champ).val().length;
		   
		   if (iLongueur>max) {
		      $('#'+champ).val() = $('#'+champ).value.substring(0,max);
		      iLongueurRestante = 0;
		   }
		   else {
		      iLongueurRestante = max - iLongueur;
		   }

		   $('.'+classe).html("<i class='icon-pencil'></i> "+iLongueur+"/"+max);
		}

	//Efface un formulaire
		var effacerForm = function(idForm) {
		  	$(':input','#'+idForm)
		   	.not(':button, :submit, :reset, :hidden')
		   	.val('')
		   	.removeAttr('checked')
		   	.removeAttr('selected');
		}

	//Ajouter des slash à une chaine de caractères
		function addslashes (str) {
		  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
		}


// Séquences =======================>
    //Créer une nouvelle séquence
        var createNewSequence = function(title, description, url) {
            
            var myUrl_Post = cfgWs.prefix+"/platoatic/ressource/"+pseudo;
            console.log(">> createNewSequence");
            var message = {
                "resType": resType.sequence, 
                "resTitle": escape(title),
                "resDesc": escape(description),
                "resUrl": "",
                "resUrlThumbnail": url
            }; 

            $.ajax({
                url: myUrl_Post,
                type: "POST",
                dataType: "json",
                data: message,
                cache: false,
                timeout: 5000,
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },

                success: function(data) {

                    console.log ("createNewSequence success : " + data.resId);
                    // afficheExoSequence(pseudo, data.resId, $('#sequences_detail_res'), title);                    
                    // afficheMesSequences(pseudo, $('#sequences_res'), $('#search_seq_field').val());  
                    refreshRessourceCarousel(resType.sequence, $("#sequences_res"));                  
                },
                error: function() {
                  console.log('createNewSequence POST process error');
                  window.location.href = "./index.html";
                }
                
            });

        }; // end of createNewSequence


    //Affiche les séquences
        var afficheMesSequences = function(pseudoProf, seqDisplay, filter, active, rendu, searchTagProfil) {
            // $('#textSectionMesSequences').html("Mes séquences");
            // $('#attacheRessourceSeq').hide('fast');
            // $('#back2SeqList').hide("fast");
            // $('#seqDetailCarousel').collapse("hide");
            // $('#seqCarousel').collapse('show');
            // $('#creatNewSequence').show('fast');
            // $('#goLastSeq').show('fast');
            // $('#search_seq').show('fast');

            refreshMesSequences(pseudoProf, seqDisplay, filter, active, rendu, searchTagProfil);

        }; // end of afficheMesSequences


    //Rafraichi les séquences
        var refreshMesSequences = function(pseudoProf, seqDisplay, filter, active, rendu, searchTagProfil) {
        	
        	if($(seqDisplay).children('.rightBar_ressource').length > 0){
        		var idLast = $(seqDisplay).children('.rightBar_ressource').last().data('id');
        	} else {
        		var idLast = 0;
        	}

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/SEQUENCES/"+pseudoProf+"/"+idLast;
            var search_filter = {
                "search" : escape(filter),
                "searchTag" : escape(searchTagProfil),
                "userSearch" : ($('#seq_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#seq_search_platform:checked').val()=="on"?'true':'false')
            };

            $.ajax({
                url: myUrl_Get,
                type: "GET",
                dataType: "json",
                data: search_filter,
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                //contentType: "application/json",
                
                success: function(data) {

                	//spinningwhell
                	seqDisplay.find('.DLRessources').remove();
                	//spinningwhell

                	if (seqDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if (seqDisplay.children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
			    	}

                    var result = new EJS({url: 'js/ressources/template_ressources_list.ejs'}).render(input);

                    //spinningwhell
                    if(rendu == 'append'){
                    	seqDisplay.append(result);
                    } //spinningwhell
                    else {
                    	seqDisplay.html(result);
                    }

                    if(active){
                        seqDisplay.carousel(active);
                        seqDisplay.carousel('pause');
                    }

                    initRessourceDragging("res");
                    
                },
                error: function() { 
                  console.log('refreshMesSequences : GET process error ');
                  window.location.href = "./index.html";
                }
              }); /* end of ajax call */
        }; // end of refreshMesSequences


    //Affiche les ressources de la séquence
        var afficheExoSequence = function(pseudoProf, resId, seqDetailDisplay, title, active) {

        	console.log(pseudoProf+", "+resId+", "+seqDetailDisplay);

            if(title){
                $(seqDetailDisplay).parent().children(":first-child").children(":first-child").html("Séquences > "+unescape(title));
            }

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressource/"+pseudoProf+"/"+resId;

            $.ajax({
                url: myUrl_Get,
                type: "GET",
                dataType: "json",
                //contentType: "application/json",
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                success: function(data) {

                	if ($(seqDetailDisplay).children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if ($(seqDetailDisplay).children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant_detail",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
			    	}

                    var result = new EJS({url: 'js/ressources/template_ressources_list.ejs'}).render(input);
                    $(seqDetailDisplay).attr('data-seqid', resId);
                    $(seqDetailDisplay).data('seqid', resId);

                    $(seqDetailDisplay).html(result);

                    if(active){
                        seqDetailDisplay.carousel(active);
                        seqDetailDisplay.carousel('pause');
                    }

                    initRessourceDragging("res");

                },
                error: function() {
                  console.log('afficheExoSequence : GET process error ');
                  window.location.href = "./index.html";
                }
            }); /* end of ajax call */          
        }; // end of afficheExoSequence

// END Séquences ===================>
//==================================>
// Exercices =======================>

    //Créer un nouvel exercice
        var createNewExercice = function(resId, url, title, desc, thumbnail) {


            // studio(resId, url, title, desc, thumbnail);
            studio(resId, url, escape(title), escape(desc), escape(thumbnail));

        } // end of createNewExercice


    //Redirige vers le studio
        var studio = function(resId, url, title, desc, thumbnail) {

            console.log("studio["+resId+" - " + url + "]");
            var params = "&exo_directory=" + url + "&exo_id=" + resId + "&title=" + encodeURIComponent(title) + "&desc="+encodeURIComponent(desc) + "&thumbnail="+encodeURIComponent(thumbnail);
            window.location.href = "./studio.html?"+params;

        } // end of studio


    //Affiche les exercices
        var afficheMesExercices = function(pseudoProf, exoDisplay, filter, active, rendu, searchTagProfil) {

        	if($(exoDisplay).find('.rightBar_ressource').length > 0){
        		var idLast = $(exoDisplay).find('.rightBar_ressource').last().data('id');
        	} else {
        		var idLast = 0;
        	}

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/EXERCICES/"+pseudoProf+"/"+idLast;
            var search_filter = {
                "search" : escape(filter),
                "searchTag" : escape(searchTagProfil),
                "userSearch" : ($('#res_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#res_search_platform:checked').val()=="on"?'true':'false')
            };

            $.ajax({
                url: myUrl_Get,
                type: "GET",
                dataType: "json",
                data: search_filter,
                //contentType: "application/json",
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                success: function(data) {

                	//spinningwhell
                	exoDisplay.find('.DLRessources').remove();
                	//spinningwhell

                	if (exoDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if (exoDisplay.children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
			    	}

                    var result = new EJS({url: 'js/ressources/template_ressources_list.ejs'}).render(input);

                    //spinningwhell
                    if(rendu == 'append'){
                    	exoDisplay.append(result);
                    } //spinningwhell
                    else {
                    	exoDisplay.html(result);
                    }

                    if(active){
                        exoDisplay.carousel(active);
                        exoDisplay.carousel('pause');
                    }

                    initRessourceDragging("res");
                    initExternalDragging();

                },
                error: function() { 
                  console.log('afficheMesExercices : GET process error ');
                  window.location.href = "./index.html";
                }
              }); /* end of ajax call */
        }; // end of afficheMesExercices


    //Duplique une exercice
        var duplicateExo = function(resId, event) {

            event.stopPropagation();

            var myUrl_Post = cfgWs.prefix+"/platoatic/ressource/"+pseudo+"/"+resId;
            var message = {
                'selectionType' : 'duplicate'
            }; 

            $.ajax({
                url: myUrl_Post,
                type: "POST",
                dataType: "json",
                data: message,
                cache: false,
                timeout: 5000,
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                success: function(data) {

                    console.log ("duplicateExo success "+resId);
                    refreshRessourceCarousel(resType.exercice, $('#mesRessources'));
                },

                error: function() {
                  console.log('selectionneRessources POST process error');
                  window.location.href = "./index.html";
                }

            });
        } // end of duplicateExo

    //Selection d'une ressource mookitek
	var selectionneRessources = function(element) {

			console.log("selectionneRessources : " + element.data('resid'));
			var myUrl_Post = cfgWs.prefix+"/platoatic/ressource/"+pseudo+"/"+element.data('resid');
	        var message = "na"; 

	        $.ajax({
	            url: myUrl_Post,
	            type: "POST",
	            dataType: "json",
	            data: message,
	            cache: false,
	            timeout: 5000,
	            //crossDomain: true,
          		xhrFields: {
            		withCredentials : true
          		},
	            success: function(data) {

	            	console.log ("selectionneRessources success");
	          		//afficheListeClasse();

	           	},

	            error: function() {
	              console.log('selectionneRessources POST process error');
	              window.location.href = "./index.html";
	            }

	        });
		}; // end of selectionneRessources        

// End Exercices ===================>
//==================================>
// Fiches ==========================>

        var afficheMesFiches = function(pseudoProf, ficheDisplay, filter, active, rendu, searchTagProfil) {

        	if($(ficheDisplay).find('.rightBar_ressource').length > 0){
        		var idLast = $(ficheDisplay).find('.rightBar_ressource').last().data('id');
        	} else {
        		var idLast = 0;
        	}

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/FICHES/"+pseudoProf+"/"+idLast;

            var search_filter = {
                "search" : escape(filter),
                "searchTag" : escape(searchTagProfil),
                "userSearch" : ($('#res_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#res_search_platform:checked').val()=="on"?'true':'false')
            };
            $.ajax({
                url: myUrl_Get,
                type: "GET",
                dataType: "json",
                data: search_filter,
                //contentType: "application/json",
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                success: function(data) {

                	//spinningwhell
                	ficheDisplay.find('.DLRessources').remove();
                	//spinningwhell

                	if (ficheDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if (ficheDisplay.children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
			    	}

                    var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);

                    //spinningwhell
                    if(rendu == 'append'){
                    	ficheDisplay.append(result);
                    } //spinningwhell
                    else {
                    	ficheDisplay.html(result);
                    }

                    if(active){
                        ficheDisplay.carousel(active);
                        ficheDisplay.carousel('pause');
                    }

                    // initExternalFicheDragging();
                    initExternalDragging();
                    initRessourceDragging("res");

                },
                error: function() { 
                  console.log('afficheMesFiches : GET process error ');
                  window.location.href = "./index.html";
                }
              }); /* end of ajax call */

        }; // end of afficheMesFiches

// End Fiches ======================>
//==================================>
// Images ==========================>

        var afficheMesImages = function(pseudoProf, imgDisplay, filter, active, rendu, searchTagProfil) {

        	if($(imgDisplay).find('.rightBar_ressource').length > 0){
        		var idLast = $(imgDisplay).find('.rightBar_ressource').last().data('id');
        	} else {
        		var idLast = 0;
        	}

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/IMAGES/"+pseudoProf+"/"+idLast;

			console.log("checkbox : " + $('#res_search_ressource').val());

            var search_filter = {
                "search" : escape(filter),
                "searchTag" : escape(searchTagProfil),
                "userSearch" : ($('#res_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#res_search_platform:checked').val()=="on"?'true':'false')
            };

            $.ajax({
                url: myUrl_Get,
                type: "GET",
                dataType: "json",
                data: search_filter,
                //contentType: "application/json",
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                success: function(data) {

                	//spinningwhell
                	imgDisplay.find('.DLRessources').remove();
                	//spinningwhell

                	if (imgDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if (imgDisplay.children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
		    		}

                    var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);

                    //spinningwhell
                    if(rendu == 'append'){
                    	imgDisplay.append(result);
                    } //spinningwhell
                    else {
                    	imgDisplay.html(result);
                    }

                    if(active){
                        imgDisplay.carousel(active);
                        imgDisplay.carousel('pause');
                    }

                    initExternalDragging();
                    initRessourceDragging("res");

                },
                error: function() { 
                  console.log('afficheMesImages : GET process error ');
                  window.location.href = "./index.html";
                }
              }); /* end of ajax call */
        }; // end of afficheMesImages

// End Images ======================>
//==================================>
// Audios ==========================>

        var afficheMesAudio = function(pseudoProf, audioDisplay, filter, active, rendu, searchTagProfil) {

        	if($(audioDisplay).find('.rightBar_ressource').length > 0){
        		var idLast = $(audioDisplay).find('.rightBar_ressource').last().data('id');
        	} else {
        		var idLast = 0;
        	}

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/AUDIOS/"+pseudoProf+"/"+idLast;

            var search_filter = {
                "search" : escape(filter),
                "searchTag" : escape(searchTagProfil),
                "userSearch" : ($('#res_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#res_search_platform:checked').val()=="on"?'true':'false')
            };
            $.ajax({
                url: myUrl_Get,
                type: "GET",
                dataType: "json",
                data: search_filter,
                //contentType: "application/json",
                //crossDomain: true,
                xhrFields: {
                    withCredentials : true
                },
                success: function(data) {

                	//spinningwhell
                	audioDisplay.find('.DLRessources').remove();
                	//spinningwhell

                	if (audioDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if (audioDisplay.children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
			    	}

                    var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);

                    //spinningwhell
                    if(rendu == 'append'){
                    	audioDisplay.append(result);
                    } //spinningwhell
                    else {
                    	audioDisplay.html(result);
                    }

                    if(active){
                        audioDisplay.carousel(active);
                        audioDisplay.carousel('pause');
                    }

                    // initExternalAudioDragging();
                    initExternalDragging();
                    initRessourceDragging("res");

                },
                error: function() { 
                  console.log('afficheMesAudio : GET process error ');
                  window.location.href = "./index.html";
                }
              }); /* end of ajax call */
        }; // end of afficheMesAudio

    //Lancement du modal des ressources
        var LaunchModalRessource = function(){

        //Bontons imagette
            //Ajout
            $('#inputNewRes_img').click(function(event) {

                event.preventDefault();
                $('#modalNewRessource').modal('hide');
                $('#modalNewRessource_img').modal('show');
                imageView($('#search_modal_input').val(), '#imagette_carousel');

            });
            //Fermeture par bouton
            $('#close_modale_img').click(function(event){
            	$('#modalNewRessource_img').modal('hide');
                $('#modalNewRessource').modal('show');
            });
            //Fermeture par clic exterieur
            $('#modalNewRessource_img').bind('hidden', function(event) {
                $('#modalNewRessource').modal('show');
            });

        //Bouton "Valider" du modal de définition des ressources
            $('#creat_new_ressource').click(function(event){
                event.preventDefault();
                submitForm();
            });

        //Champ de recherche pour les images
            $('#search_modal_input').change(function(event) {
                imageView($('#search_modal_input').val(), '#imagette_carousel');
            });

        //Champ de recherche pour les images
            $('.img_modal_search_checkbox').change(function(event) {
            	console.log("change on modal_search_checkbox => "+$(this).attr('id')+" => "+$("#"+$(this).attr("id")+":checked").val());
                event.preventDefault();
                imageView($('#search_modal_input').val(), '#imagette_carousel');
            });

            $('#inputNewRes_title').keypress(function(event){
            	if(event.keyCode == 13) {
            		event.preventDefault();
            		event.stopPropagation();
            		submitForm();
            	}
            });
        
        }// End LaunchModalRessource

        var submitForm = function(){
        	
        	//Valider pour une nouvelle sequence
            if (($('#creat_new_ressource').data('type')==resType.sequence)&&(!$('#creat_new_ressource').data('resid'))){
                createNewSequence($('#inputNewRes_title').val(), $('#inputNewRes_desc').val(), $('#inputNewRes_img>img').attr('href'));
                effacerForm_NewRess();
            }

            //Valider pour un nouvel exercice
            else if(($('#creat_new_ressource').data('type')==resType.exercice)&&(!$('#creat_new_ressource').data('resid'))){
                createNewExercice("new", "", $('#inputNewRes_title').val(), $('#inputNewRes_desc').val(), $('#inputNewRes_img>img').attr('href'));
            }

            //Sinon modification de la ressource
            else {
                ressourceDefined($('#creat_new_ressource').data('resid'), $('#inputNewRes_title').val(), $('#inputNewRes_desc').val(), $('#creat_new_ressource').data('url'), $('#inputNewRes_img>img').attr('href'), $('#creat_new_ressource').data('type'));
                effacerForm_NewRess();
            }

            $('#modalNewRessource').modal('hide');
    	}

    //Permet d'effacer le formulaire de création d'une ressource
        var effacerForm_NewRess = function(){
            $('.decompteTitre').html('');
            $('.decompteDesc').html('');
            $('.decompteKey').html('');
            $('#inputNewRes_img').html('<button class="btn" style="width: 220px;">Ajouter une imagette</button>');

            $('#inputNewRes_img').attr('data-thumbnail', '')
            $('#inputNewRes_img').data('thumbnail','');
            
            effacerForm('form_newRessource');
        }//end effacerForm_NewRess

    //Selection d'une imagette
        var imageSelected = function (thumbnail, divId, type) {
            
            if ((thumbnail == '')||(thumbnail == 'undefined'))
            {
                $(divId).html('<button class="btn" style="width: 220px;">Ajouter une imagette</button>');
                
            }else{

            	var chemin;
                switch(parseInt(type)){

                	case resType.sequence :
                		chemin = UrlThumbnailType.sequence;
                		break;
                	
                	case resType.exercice :
                		chemin = UrlThumbnailType.exercice;
                		break;
                	
                	case resType.fiche :
                		chemin = UrlThumbnailType.fiche;
                		break;
                	
                	case resType.image :
                		chemin = UrlThumbnailType.image;
                		break;
                	
                	case resType.audio :
                		chemin = UrlThumbnailType.audio;
                		break;
                	
                	case resType.video :
                		chemin = UrlThumbnailType.video;
                		break;

                	default :
                		chemin = UrlThumbnailType.image;
                		break;
                }

                $(divId).html('<img src="'+chemin+thumbnail+'" height=160px width=120px href="'+thumbnail+'">');
            }
            
            $(divId).data('thumbnail', thumbnail);
            $('#modalNewRessource').modal('show');

        } // end of imageSelected

        // Vidéos ==========================>

		var afficheMesVideo = function(pseudoProf, videoDisplay, filter, active, rendu, searchTagProfil) {

			if($(videoDisplay).find('.rightBar_ressource').length > 0){
        		var idLast = $(videoDisplay).find('.rightBar_ressource').last().data('id');
        	} else {
        		var idLast = 0;
        	}

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/VIDEOS/"+pseudoProf+"/"+idLast;

	        var search_filter = {
	        	"search" : escape(filter),
	        	"searchTag" : escape(searchTagProfil),
                "userSearch" : ($('#res_search_ressource:checked').val()=="on"?'true':'false'),
				"platformSearch" : ($('#res_search_platform:checked').val()=="on"?'true':'false')
	        };
	        $.ajax({
	            url: myUrl_Get,
	            type: "GET",
	            dataType: "json",
	            data: search_filter,
	            //contentType: "application/json",
	            //crossDomain: true,
          		xhrFields: {
            		withCredentials : true
          		},
	            success: function(data) {

	            	//spinningwhell
                	videoDisplay.find('.DLRessources').remove();
                	//spinningwhell

                	if (videoDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
                		var ressource = true;
                	}else{
                		var ressource = false;
                	}

                	if (videoDisplay.children().eq(-1).hasClass('noRessources')) {
                		return false;
                	};

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'pseudo' : pseudoProf,
			    		"ressource" : ressource
			    	}

	              	var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);

                    //spinningwhell
                    if(rendu == 'append'){
                    	videoDisplay.append(result);
                    } //spinningwhell
                    else {
                    	videoDisplay.html(result);
                    }

					initExternalDragging();
					initRessourceDragging("res");

	           	},
	            error: function() { 
	              console.log('afficheMesVideo : GET process error ');
	              window.location.href = "./index.html";
	            }
	          }); /* end of ajax call */
		}; // end of afficheMesVideo

	//###########################################
	//### [DEBUT] Upload d'un fichier externe ###
	//###########################################

		var clickExternal;

		/**
		 *	Fonction pour uploader un fichier
		 *
		 *	@param tupfile Integer Nb total de fichier à uploader
		 */
		var uploadFileExt = function (event, tupfile, element) {

			if (element.attr('name') == "dropzone_external")
				var upresfile = event.dataTransfer;
			else if (element.attr('name') == "uploadfile")
				var upresfile = document.getElementById(element.attr('id'));
			else return false;

			//loading element
			var trLoad= "<tr id=\"trLoad\"><td colspan=\"4\" style=\"text-align: center;\"><img src=\"/img/gif-load.GIF\" /></td></tr>";
			
			//conteur de requete XML
			var cmtXMLReq = 0;

			$('#cancel_drop_ext, #valid_drop_ext').hide();
			$('#dropFileExtModalLabel').html('Upload de '+(tupfile)+' fichier(s) en cours');
			$('#dropFileExtModal .modal-body').html("<div id='dropFileExtModalBody'></div>");
			$('#dropFileExtModal #dropFileExtModalBody').append("<table class=\"table table-striped table-hover\"><tbody></tbody></table>");

			//Pour chaque fichier à uploader
			for (var i = 0; i < tupfile; i++) {
				
				//On rajoute un loading
				$('#dropFileExtModal #dropFileExtModalBody tbody').append(trLoad);

				var formData = new FormData();
				var file = upresfile.files[i];
				formData.append('file', file);

				var myUrl_Post = cfgWs.prefix+"/platoatic/files/"+pseudo; // WOrkaround for android limitation with credentials

				var xhr = new XMLHttpRequest();
				xhr.open('post', myUrl_Post);
				xhr.withCredentials = 'true';

				//Elements draggés
				xhr.onload = function(event) {
					console.log("xhr.onload ...");
					console.log(event.target);
					var ret = JSON.parse(event.target.response);
					if (ret.result == "success") {

						//Si derniere requête XML on affiche les bouton pour annuler ou accepter
						if(cmtXMLReq==(tupfile-1)) $('#cancel_drop_ext, #valid_drop_ext').show();

						//On supprime le loading
						$('#trLoad').remove();

						//On génère la ligne du fichier
						$('#dropFileExtModal #dropFileExtModalBody tbody').append('<tr class="'+ret.resId+'" data-url="'+ret.url+'" data-urlThumbnail="'+ret.urlThumbnail+'" data-type="'+ret.resType+'"></tr>');
						$('#dropFileExtModal #dropFileExtModalBody tbody tr.'+ret.resId).append("<td>Titre</td>");
						$('#dropFileExtModal #dropFileExtModalBody tbody tr.'+ret.resId).append("<td><input class='titleExt input-medium' type='text' maxlength='30' value='"+ret.title.slice(0, 30)+"' placeholder='Renseigner le titre'/></td>");
						$('#dropFileExtModal #dropFileExtModalBody tbody tr.'+ret.resId).append("<td>Description</td>");
						$('#dropFileExtModal #dropFileExtModalBody tbody tr.'+ret.resId).append("<td><textarea class='descExt' maxlength='250' style='width:auto; resize: none;' placeholder='Renseigner la description'>"+ret.desc.slice(0, 30)+"</textarea></td>");
						
						cmtXMLReq++
					}
					else {
						console.log("error received from upload");
						$('#dropFileExtModal').modal('hide');
					}

				};

				//Barre de chargement
				xhr.upload.onprogress = function(event) {

					// TODO : modify progress bar modal
					var percent = (event.loaded / event.total ) * 100;
					$('#progress_bar_extern').html("<div class=\"bar\" style=\"padding: 5px; width: "+percent+"%;\">"+percent+"%</div>")
				};
				
				xhr.send(formData);
			}

			clickExternal = 0;
		}

		/**
		 *	Appyue sur le bouton de validation
		 */
		$('#valid_drop_ext').click(function(event){
			$('#dropFileExtModal #dropFileExtModalBody tbody tr').each(function(){
				ressourceDefined($(this).attr('class'), $(this).find('.titleExt').val(), $(this).find('.descExt').val(), $(this).data('url'), $(this).data('urlthumbnail'), $(this).data('type'), "no")
			})
			clickExternal = 1;
			$('#dropFileExtModal').modal('hide');
		})

		/**
		 *	Appyue sur le bouton d'annulation
		 */
		$('#cancel_drop_ext').click(function(event){
			$('#dropFileExtModal #dropFileExtModalBody tbody tr').each(function(){
				removeRessource($(this).attr('class'))
			})
			clickExternal = 1;
			$('#dropFileExtModal').modal('hide');
		})

		/**
		 *	Quand on cache le modal
		 */
		$('#dropFileExtModal').bind('hide', function(){
			if(clickExternal == 0){
				$('#dropFileExtModal #dropFileExtModalBody tbody tr').each(function(){
					ressourceDefined($(this).attr('class'), $(this).find('.titleExt').val(), $(this).find('.descExt').val(), $(this).data('url'), $(this).data('urlthumbnail'), $(this).data('type'), "no")
				})
			}
			refreshRessourceCarousel($('#dropFileExtModal #dropFileExtModalBody tbody tr:last-child').data('type'), $("#mesRessources"));
			$('#uploadNewRes').val('');
		})

	//###########################################
	//#### [FIN] Upload d'un fichier externe ####
	//###########################################