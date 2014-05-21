
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
	var manageRessource = function(resId, type, titre, desc, url, thumbnail, etat) {

		console.log("manageRessource : " + resId);
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

		console.log(etat)

		$('#inputNewRes_title').parent().parent().css("display", "block");
		$('#inputNewRes_desc').parent().parent().css("display", "block");
		$('#NewRes_motcle').css("display", "block");
		$('#inputNewRes_file').parent().parent().css("display", "block");
		$('#NewRes_img').css("display", "block");

		//--------------------------------------------------------------------->
		//A supprimer pour upload fichier ------------------------------------->
		$('#creat_new_ressource').css("display", "");
		$("#MsgWaitNewRessource").css('display', 'none');
		//A supprimer pour upload fichier ------------------------------------->
		//--------------------------------------------------------------------->

		//Si image
		if (num_type == resType.image){
			$('#NewRes_img').css("display", "none");
		}

		//si nouvelle séquence ou exercice ou nouveau drop externe
		if ((((num_type == resType.sequence)||(num_type == resType.exercice))&&(!resId))||(etat == "new_ext")){

			if(etat != "new_ext"){
				$('#NewRes_motcle').css("display", "none");
			}

			// $('#inputNewRes_title').attr("onKeyPress", "if(event.keyCode == 13) {return false;}");
			$('#inputNewRes_file').parent().parent().css("display", "none");

		}
		//Si nouvelle ressource
		else if (etat == "new"){
			$('#NewRes_motcle').css("display", "none");

			//--------------------------------------------------------------------->
			//A supprimer pour upload fichier ------------------------------------->
			$("#MsgWaitNewRessource").css('display', 'block');
			$("#MsgWaitNewRessource").html('<h2>Coming soon !!</h2> <p>Pour créer une nouvelle ressource (document, image, audio ou vidéo), merci de la déposer tout simplement dans la partie ressource (3ème colonne).</p>');
			$('#creat_new_ressource').css("display", "none");

			$('#inputNewRes_title').parent().parent().css("display", "none");
			$('#inputNewRes_desc').parent().parent().css("display", "none");
			$('#NewRes_motcle').css("display", "none");
			$('#inputNewRes_file').parent().parent().css("display", "none");
			$('#NewRes_img').css("display", "none");
			//A supprimer pour upload fichier ------------------------------------->
			//--------------------------------------------------------------------->
		}
		//Si modification
		else if (!etat){
			$('#resModalLabel').html('Modification de la ressource');
			$('#inputNewRes_title').parent().parent().css("display", "none");
			$('#inputNewRes_desc').parent().parent().css("display", "none");
			$('#inputNewRes_file').parent().parent().css("display", "none");
		}

		//Doublon pour le DOM (attr) et le cache JQuery (data)
		$('#NewRes_motcle').attr('data-resid', resId).data('resid', resId);
		afficherTag(resId, '#tagNewRes');

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
			ressourceDefined(id, newTitle, newDesc, url, urlThumbnail, num_type);
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
	var ressourceDefined = function(id, title, desc, url, urlThumbnail, type){

		var myUrl_Put = cfgWs.prefix+"/platoatic/ressources/" + pseudo + "/VERRU_MODIF/" + id;

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
	      		refreshRessourceCarousel(type);

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
	var refreshRessourceCarousel = function(type) {

        if(type==resType.sequence) {
			console.log('manage séquence');
			// var active=$('.carousel-inner[name="sequence_carousel"]').children('.active').data('index');
			afficheMesSequences(pseudo, $('#sequences_res'), $('#search_seq_field').val());
			// afficheMesSequences(pseudo, $('.carousel-inner[name="sequence_carousel"]'), $('#search_seq_field').val(), active);
        }
        else if(type==resType.exercice) {
			console.log('manage exercice');
			// var active=$('.carousel-inner[name="exercice_carousel"]').children('.active').data('index');
			// afficheMesExercices(pseudo, $('#exercices_res'), $('#search_exo_field').val(), active);
			$('.ressources_ens').find('.brand').html('Mes exercices');
			afficheMesExercices(pseudo, $('#mesRessources'), $('#search_field').val());
			// afficheMesExercices(pseudo, $('.carousel-inner[name="exercice_carousel"]'), $('#search_exo_field').val(), active);
		}
		else if(type==resType.fiche) {
			console.log('manage fiche');
			// var active=$('.carousel-inner[name="fiche_carousel"]').children('.active').data('index');
			// afficheMesFiches(pseudo, $('#document_res'), $('#search_fiche_field').val(), active);
			$('.ressources_ens').find('.brand').html('Mes documents');
			afficheMesFiches(pseudo, $('#mesRessources'), $('#search_field').val()); 
			// afficheMesFiches(pseudo, $('.carousel-inner[name="fiche_carousel"]'), $('#search_fiche_field').val(), active); 
		}
		else if(type==resType.image) {
			console.log('manage image');
			// var active=$('.carousel-inner[name="image_carousel"]').children('.active').data('index');
			// afficheMesImages(pseudo, $('#image_res'), $('#search_image_field').val(), active);
			$('.ressources_ens').find('.brand').html('Mes images');
			afficheMesImages(pseudo, $('#mesRessources'), $('#search_field').val());
			// afficheMesImages(pseudo, $('.carousel-inner[name="image_carousel"]'), $('#search_image_field').val(), active);
		}
		else if(type==resType.audio) {
			console.log('manage audio');
			// var active=$('.carousel-inner[name="audio_carousel"]').children('.active').data('index');
			// afficheMesAudio(pseudo, $('#audio_res'), $('#search_audio_field').val(), active);
			$('.ressources_ens').find('.brand').html('Mes audios');
			afficheMesAudio(pseudo, $('#mesRessources'), $('#search_field').val());
			// afficheMesAudio(pseudo, $('.carousel-inner[name="audio_carousel"]'), $('#search_audio_field').val(), active);
		}
		else if(type==resType.video) {
			console.log('manage video');
			// afficheMesVideo(pseudo, $('#video_res'), $('#search_video_field').val());
			$('.ressources_ens').find('.brand').html('Mes vidéos');
			afficheMesVideo(pseudo, $('#mesRessources'), $('#search_field').val());
			// afficheMesAudio(pseudo, $('.carousel-inner[name="audio_carousel"]'), $('#search_audio_field').val(), active);
		}

		$('.ressources_ens').find('#search_field').attr('data-type', type).data('type', type);
        $('.ressources_ens').find('#creatNewRessource').attr('data-type', type).data('type', type);

	}//end of refreshRessourceCarousel

	/**
	 *	Affiche la liste des tags pour une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param divId Integer	identifiant de la div dans laquelle nous voulons afficher les tags
	 */
	var afficherTag = function(resId, divId){
    	console.log("afficherTag for "+resId);

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

            	var input = {
		    		'data' : data,
		    		'resId' : resId
		    	};

				var result = new EJS({url: 'js/ressources/template_tag.ejs'}).render(input);

				$(divId).html(result);
            		            
           	},
            error: function() {
              console.log('tagDefined POST process error');
              //window.location.href = "./index.html";
            }

        });
    	
    }

	/**
	 *	Ajout d'un tag a une ressource
	 *
	 *	@param resId Integer	identifiant de la ressources 
	 *	@param tag String 		tag à ajouter
	 */
	var tagDefined = function(resId, tag) {

		if(!tag){
			return false;
		}

		console.log(escape(tag))

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
            	afficherTag(resId, '#tagNewRes');
            
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

            	afficherTag(resId, '#tagNewRes');
            
           	},
            error: function() {
              console.log('tagDefined POST process error');
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

			console.log('imgView from ressource.js');
			var myUrl_Get = cfgWs.prefix + "/platoatic/ressources/"+pseudo+"/type/IMAGES/";

			// console.log("checkbox : " + $('#res_search_ressource').val());

			var search_filter = {
				"search" : escape(filter),
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
		var attachRessourceToSequence = function (noSeq, resId, position, seqDetailDisplay) {

			var myUrl_Put = cfgWs.prefix+"/platoatic/ressources/" + pseudo + "/VERRU_MODIF/" + noSeq;

	        console.log("attachRessourceToSequence [" + myUrl_Put + "] " + resId + " - " + position);

	        var message;
	        message = {
	        	"action":"attach_ressource",  
	        	"resId": resId, 
	        	"position": position
	        };
	        
	        console.log(message);
	        
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
	              	afficheExoSequence(pseudo, noSeq, seqDetailDisplay, $('#inputSeqTitle').val());
	           	},
	            error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(textStatus);
	            	console.log(errorThrown);
	              	console.log('attachRessourceToSequence PUT process error');
	            }

	          });

		}; // end of attachRessourceToSequence

	//Détacher une ressource d'une séquence
		var detachRessourceToSequence = function (noSeq, resId) {

			var myUrl_Put = cfgWs.prefix+"/platoatic/ressources/" + pseudo + "/VERRU_MODIF/" + noSeq;

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
	           	},
	            error: function(jqXHR, textStatus, errorThrown) {
	            	console.log(textStatus);
	            	console.log(errorThrown);
	              	console.log('detachRessourceToSequence PUT process error');
	            }

	          });

		}; // end of detachRessourceToSequence	


	//Supprimer une ressource
		var removeRessource = function(resId) {

			var myUrl_Put = cfgWs.prefix+"/platoatic/ressources/" + pseudo + "/VERRU_DELETE/" + resId;
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

			var myUrl_Post = cfgWs.prefix+"/platoatic/ressources/" + pseudo + "/VERRU_MODIF/" + resId;

	        console.log("createRessourceRelation [" + myUrl_Post + "] " + resId + "-" + urlExo);

	        var message;
	        message = {"action":"attach_exo_ressources",  "resId": resId, "resUrl": urlExo};
	        
	        console.log(message);
	        
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
            
            var myUrl_Post = cfgWs.prefix+"/platoatic/ressources/"+pseudo;
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
                    afficheMesSequences(pseudo, $('#sequences_res'), $('#search_seq_field').val());                    
                },
                error: function() {
                  console.log('createNewSequence POST process error');
                  window.location.href = "./index.html";
                }
                
            });

        }; // end of createNewSequence


    //Affiche les séquences
        var afficheMesSequences = function(pseudoProf, seqDisplay, filter, active) {

            // $('#textSectionMesSequences').html("Mes séquences");
            // $('#attacheRessourceSeq').hide('fast');
            // $('#back2SeqList').hide("fast");
            // $('#seqDetailCarousel').collapse("hide");
            // $('#seqCarousel').collapse('show');
            // $('#creatNewSequence').show('fast');
            // $('#goLastSeq').show('fast');
            // $('#search_seq').show('fast');

            refreshMesSequences(pseudoProf, seqDisplay, filter, active);

        }; // end of afficheMesSequences


    //Rafraichi les séquences
        var refreshMesSequences = function(pseudoProf, seqDisplay, filter, active) {

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/type/SEQUENCES/";
            var search_filter = {
                "search" : escape(filter),
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

                    var input = {
                        'data' : data,
                        'mode' : 'enseignant',
                        'display' : seqDisplay
                    };

                    var result = new EJS({url: 'js/ressources/template_ressources_list.ejs'}).render(input);
                    seqDisplay.html(result);

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

        	console.log("refresh sequence detail");
        	console.log(pseudoProf+", "+resId+", "+seqDetailDisplay);

            if(title){
                $(seqDetailDisplay).parent().children(":first-child").children(":first-child").html("Séquences > "+unescape(title));
            }

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/"+resId;

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

                    var input = {
                        'data' : data,
                        'mode' : 'enseignant_detail',
                        'display' : seqDetailDisplay
                    };

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

            console.log("createNewExercice");
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
        var afficheMesExercices = function(pseudoProf, exoDisplay, filter, active) {

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/type/EXERCICES/";
            var search_filter = {
                "search" : escape(filter),
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

                    var input = {
                        'data' : data,
                        'pseudo' : pseudoProf,
                        "mode" : "enseignant",
                        'display' : exoDisplay
                    };

                    var result = new EJS({url: 'js/ressources/template_ressources_list.ejs'}).render(input) 
                    exoDisplay.html(result);

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
        var duplicateExo = function(resId) {

            event.stopPropagation();

            var myUrl_Post = cfgWs.prefix+"/platoatic/ressources/"+pseudo+"/"+resId;
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
                    // afficheMesExercices(pseudo, $('.carousel-inner[name="exercice_carousel"]'), $('#search_exo_field').val());
                    afficheMesExercices(pseudo, $('#mesRessources'), $('#search_field').val());
                    // afficheMesExercices(pseudo, $('.rightBar_ressource[data-resid="'+resId+'"]').parent(), $('#search_exo_field').val());
                    // afficheMesExercices(pseudo, $('#exercices_res[data-index="'+idMenu+'"]'), $('#search_exo_field').val());
                },

                error: function() {
                  console.log('selectionneRessources POST process error');
                  window.location.href = "./index.html";
                }

            });
        } // end of duplicateExo

        

// End Exercices ===================>
//==================================>
// Fiches ==========================>

        var afficheMesFiches = function(pseudoProf, ficheDisplay, filter, active) {

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/type/FICHES/";

            var search_filter = {
                "search" : escape(filter),
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

                    var input = {
                        'data' : data,
                        'mode' : "enseignant",
                        'display' : ficheDisplay
                    }

                    var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);
                    ficheDisplay.html(result);

                    if(active){
                        ficheDisplay.carousel(active);
                        ficheDisplay.carousel('pause');
                    }

                    // initExternalFicheDragging();
                    initExternalDragging();
                    initRessourceDragging("res");;

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

        var afficheMesImages = function(pseudoProf, imgDisplay, filter, active) {

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/type/IMAGES/";

			console.log("checkbox : " + $('#res_search_ressource').val());


            var search_filter = {
                "search" : escape(filter),
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

                    var input = {
                        "data" : data,
                        "mode" : "enseignant",
                        'display' : imgDisplay
                    }

                    var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);
                    imgDisplay.html(result);

                    if(active){
                        imgDisplay.carousel(active);
                        imgDisplay.carousel('pause');
                    }

                    // initExternalImgDragging();
                    initExternalDragging();
                    initRessourceDragging("res");

                    // $(imgDisplay).children().each(function(){
                    //     $(this).draggable({ 
                    //         revert: true,
                    //         opacity: 0.5
                    //     });
                    // });

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

        var afficheMesAudio = function(pseudoProf, audioDisplay, filter, active) {

            var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/type/AUDIOS/";

            var search_filter = {
                "search" : escape(filter),
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

                    var input = {
                        "data" : data,
                        "mode" : "enseignant",
                        'display' : audioDisplay
                    }

                    var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);
                    audioDisplay.html(result);

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
                $('#modalNewRessource').modal('show');
            });
            //Fermeture par clic exterieur
            $('#modalNewRessource_img').bind('hidden', function(event) {
                $('#modalNewRessource').modal('show');
            });

        //Bouton "Valider" du modal de définition des ressources
            $('#creat_new_ressource').click(function(event){
                event.preventDefault();

            //Valider pour une nouvelle sequence
                if (($('#creat_new_ressource').data('type')==resType.sequence)&&(!$('#creat_new_ressource').data('resid'))){
                    createNewSequence($('#inputNewRes_title').val(), $('#inputNewRes_desc').val(), $('#inputNewRes_img>img').attr('href'));
                    effacerForm_NewRess();
                }

            //Valider pour un nouvel exercice
                else if(($('#creat_new_ressource').data('type')==resType.exercice)&&(!$('#creat_new_ressource').data('resid'))){
                    createNewExercice("new", "", $('#inputNewRes_title').val(), $('#inputNewRes_desc').val(), $('#inputNewRes_img>img').attr('href'));
                }

            // //Valider pour une nouvelle ressource (sans D'n'D)
            //     else if(($('#creat_new_ressource').data('type'))&&(($('#creat_new_ressource').data('type')!=resType.sequence)||($('#creat_new_ressource').data('type')!=resType.exercice))) {
            //         console.log('creatnewfile >> idRess : '+ $('#creat_new_ressource').data('type') +' (function no implement)');
            //     }

            //Sinon modification de la ressource
                else {
                    ressourceDefined($('#creat_new_ressource').data('resid'), $('#inputNewRes_title').val(), $('#inputNewRes_desc').val(), $('#creat_new_ressource').data('url'), $('#inputNewRes_img>img').attr('href'), $('#creat_new_ressource').data('type'));
                    effacerForm_NewRess();
                }

                $('#modalNewRessource').modal('hide');

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
        
        }// End LaunchModalRessource

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

		var afficheMesVideo = function(pseudoProf, videoDisplay, filter, active) {

	        var myUrl_Get = cfgWs.prefix+"/platoatic/ressources/"+pseudoProf+"/type/VIDEOS/";

	        var search_filter = {
	        	"search" : escape(filter),
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

			    	var input = {
			    		"data" : data,
			    		"mode" : "enseignant",
			    		'display' : videoDisplay
			    	}

	              	var result = new EJS({url: 'js/ressources/template_ressources_list'}).render(input);
					videoDisplay.html(result);

					/*if(active){
						videoDisplay.carousel(active);
						videoDisplay.carousel('pause');
					}
					else {
						videoDisplay.carousel(videoDisplay.children().last().data('index'));
    					videoDisplay.carousel("pause");
					}*/

					initExternalDragging();
					initRessourceDragging("res");

	           	},
	            error: function() { 
	              console.log('afficheMesVideo : GET process error ');
	              window.location.href = "./index.html";
	            }
	          }); /* end of ajax call */
		}; // end of afficheMesVideo