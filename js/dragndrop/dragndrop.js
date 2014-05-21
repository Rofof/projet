//==================================================>
//Début des option du drag & drop ==================>
//==================================================>

	var dragStartRessource = function(event, element)  {

		var ressource;

		if(element) ressource = $(element).parents('.rightBar_ressource');
		else ressource = $(this);

		// e.dataTransfer = e.originalEvent.dataTransfer;

		var chemin = 0;
		var type;
		event.stopPropagation();

		if ((ressource.attr('name')=="dropzone_ressource_in_seq")
			||((ressource.attr('name')=="dropzone_ressource_to_remove")&&(ressource.hasClass('sequence_detail')==false))
			||(ressource.attr('name')=="dropzone_ressource_to_remove")
			||(ressource.hasClass('SequenceInsertArea')))
		{
			return false;
		}

		ressource.parent('*').css('opacity', '0.5');
		
		if(ressource.data("resid")){
			console.log("dragStartRessource -->" + ressource.data('resid'));
			chemin = 1;
		}
		else if(ressource.data("eleveid")){
			console.log("dragStartEleve -->" + ressource.data('eleveid'));
			chemin = 2;
		}

		//draggedElement = $(this);

		if(chemin == 0){
			console.log("Error Drag : no data-resid for "+ressource.attr('id'));
		}
		//Si ressource -->
		else if(chemin == 1)
		{

			if (ressource.hasClass('ressource'+resType.sequence)){
				type = resType.sequence;
			}
			else if (ressource.hasClass('ressource'+resType.exercice)){
				type = resType.exercice;
				//break;
			}
			else if (ressource.hasClass('ressource'+resType.fiche)){
				type = resType.fiche;
				//break;
			}
			else if (ressource.hasClass('ressource'+resType.image)){
				type = resType.image;
				//break;
			}
			else if (ressource.hasClass('ressource'+resType.video)){
				type = resType.video;
				//break;
			}
			else if (ressource.hasClass('ressource'+resType.audio)) {
				type = resType.audio;
				//break;
			}

			if(ressource.hasClass('sequence_detail')){
				type = "SEQUENCE_DETAIL";
				event.stopPropagation();
			}

			var data = {
				'seqid'	: ressource.parent().data('seqid'),
				'resid' : ressource.data('resid'),
				'pseudo' : ressource.data('pseudo'),
				'type' : type,
				'elem' : 'ressource',
				'parentRefresh' : '#'+ressource.parent().attr('id')
			};
		}
		//Si élève -->
		else if(chemin == 2){

			if (ressource.attr('name')=='4Assignment'){
				type = "SEQUENCE_TO_ASSIGN";
				//break;
			}
			else if (ressource.attr('name')=='Assignment'){
				type = "ASSIGNED_SEQ";
			}
			else{
				type = "ELEVE";
			}

			var data = {
				'eleveid' : ressource.data('eleveid'),
				'type' : type,
				'elem' : 'eleve',
				'pseudo' : ressource.parent().data('pseudo'),
				'parentRefresh' : ressource.parent().attr('name')
			};

			ressource.parent('*').css('opacity', '0.5');
		}

		console.log(type);
		console.log(data);

		return JSON.stringify(data);

	}; // end of dragStartRessource


	var dragEnterRessource = function(event, element)  {
		
		var ressource;
		if(element) ressource = $(element);
		else ressource = $(this);
		
		event.preventDefault();

		if (ressource.attr('name')=="dropzone_ressource_to_remove"){
			ressource.css('padding', '50px 0');
			ressource.css('min-width', '100px');
		}

		if (ressource.attr('name')=="dropzone_ressource_to_remove"
			||ressource.attr('name')=="dropzone_ressource_in_seq"
			||ressource.hasClass('SequenceInsertArea')) {
			ressource.css('border', '3px solid rgba(100,100,100,1)');
			ressource.css('background-color', 'lightgray');
		}

		if ((ressource.attr('name')!="dropzone_ressource_in_seq")
			||(ressource.attr('name')=="dropzone_ressource_to_remove")
			||(ressource.attr('name')=="dropzone_eleve_to_remove")) {
			return false;
		}

		// $('.carousel').carousel('pause');
		
	}; // end of dragEnterRessource

	var dragLeaveRessource = function(event, element) {
		//console.log("dragLeaveRessource -->", event);

		var ressource;
		if(element) ressource = $(element);
		else ressource = $(this);

		if (ressource.attr('name')=="dropzone_ressource_to_remove"){
			ressource.css('padding', '');
			ressource.css('min-width', '');
		}

		if ($(event.currentTarget).attr('name') != "dropzone_ressource_to_remove" && $(event.currentTarget).attr('class') != "icon-trash")
			$(".encadrement_suppression").css('border', '3px solid rgba(100,100,100,0)');

		if (ressource.attr('name')=="dropzone_ressource_to_remove"
			||ressource.attr('name')=="dropzone_ressource_in_seq"
			||ressource.hasClass('SequenceInsertArea')) {
			ressource.css('border', '');
		}

		ressource[0].style.backgroundColor="";
		//$('.carousel').carousel('cycle');
		event.preventDefault();
		return false;

	}; // end of dragLeaveRessource


	var dropRessource = function(event, element, datas) {

		//event.preventDefault();

		var chemin = 0;

		var ressource;
		if(element) ressource = $(element);
		else ressource = $(this);

		try{

			data = JSON.parse(datas);

			// if(element){
			// 	var data = JSON.parse(event.originalEvent.originalEvent.dataTransfer);
			// } else {
			// 	var text = event.dataTransfer.getData('text/html');
			// 	var data = JSON.parse(text);
			// }					

			//var resid = event.dataTransfer.getData('text/html');

			switch(data.elem){
				case "ressource" :
					console.log("dropRessource -->" + data.resid);
					chemin = 1;
					break;
				case "eleve" :
					console.log("dropEleve -->" + data.eleveid);
					chemin = 2;
					break;
			}

			if(chemin == 0){
				console.log("Error Drop : no data-*id");
			}
			//Si ressource -->
			else if(chemin == 1){
				if(((ressource.attr('name')=="dropzone_ressource_in_seq")||(ressource.hasClass('sequence_detail')))
					&&data.type!='SEQUENCE_DETAIL') {
					
					ressource.css('border', '');
					
					var position = $("#sequences_detail_res").children().last().data('seqorder')+1;

					if(data.type != resType.sequence){
						attachRessourceToSequence(ressource.data('seqid'), data.resid, position, ressource, function() {callBackAffAttach(data, ressource);});
					} else {
						console.log("can't attach sequence to sequence")
					}
				}
				else if(ressource.attr('name')=="dropzone_ressource_to_remove") {
					ressource.css('border', '3px solid rgba(100,100,100,.0)');
					console.log("dropping in remove area [" + data.resid + "] (Ressource)");
					switch(data.type){
						case "SEQUENCE_DETAIL":
							detachRessourceToSequence(data.seqid, data.resid, function() {callBackAffRessource(data);});
							break;
						
						default:
							removeRessource(data.resid, function() {callBackAffRessource(data);});
							break;
					}
				}
				else if(ressource.hasClass("SequenceInsertArea")==true) {
					console.log("dropping insert sequence for student (Eleve)");
					ressource.css('border', '');

					if(data.type != resType.sequence){
						console.log('error : no sequence element');
						return false;
					}

					console.log(pseudo+", "+ressource.data('pseudo')+", "+data.resid);
					insertSequence(pseudo, ressource.data('pseudo'), data.resid, function() {callBackAffInsert(data, ressource);});
					return false;
				}
				else {
					console.log("dropping in wrong area [" + data.resid + "] (Ressource)");
				}
			}
			//Si élève -->
			else if(chemin == 2){
				if (ressource.attr('name')=="dropzone_ressource_to_remove") {
					ressource.css('border', '3px solid rgba(100,100,100,.0)');
					console.log("dropping in remove area [" + data.eleveid + "] (Eleve)");

					switch (data.type){
					case "ELEVE" :
						removeEleve(data.eleveid, function() {callBackAffEleve(data);});
						break;

					case "ASSIGNED_SEQ" :
						console.log("dropping in assignment removal area [" + data.eleveid + "] (Eleve)");
						unassignRessource(pseudo, data.pseudo, data.eleveid, function() {callBackAffEleve(data);});
						console.log("unassignRessource("+pseudo+","+data.pseudo+","+data.eleveid+");");
						break;
					}
				}
			}

			ressource[0].style.backgroundColor="";

		}catch(error){
			console.log('error : '+ error);
		}

		dragLeaveRessource(event, element)

	}; // end of dropRessource

	var callBackAffAttach = function(data, element){
		console.log('--> callBackAffAttach')
		$('.sequences_detail_res[data-seqid="'+element.data('seqid')+'"]').each(function(){
			refreshRessourceCarousel(resType.exercice, $(this));
			// afficheExoSequence(pseudo, element.data('seqid'), $(this));	
		})
	}

	var callBackAffInsert = function(data, element){
		console.log('--> callBackAffInsert')
		var selector = ".liste_sequence_eleve[name=\"" + element.attr('name') + "\"]";						
		// afficheAssignedSequence(pseudo, element.data('pseudo'), $(selector));
		refreshRessourceCarousel(resType.sequence, $(selector));
		console.log('success insertSequence');
	}

	/**
	 *	Permet de rafraichir les zones en fonction des drops effectués
	 *
	 *	@param data JSON	element initialisés au début du drag
	 */
	var callBackAffRessource = function(data){

		console.log('ok => appel callBackAffRessource => data :');
		console.log(data);

		var afficheAllExoSequence = function(){
			$('[data-id="'+data.resid+'"]').each(function () {
        		if($(this).parent().hasClass('sequences_detail_res')){
        			refreshRessourceCarousel(resType.exercice, $(this).parent());
        			// afficheExoSequence(pseudo, $(this).parent().data('seqid'), $(this).parent());
        		}
           	});
		}

		switch (data.type) {

	        case resType.sequence :
	        	refreshRessourceCarousel(resType.sequence, $("#sequences_res"));
		        // refreshMesSequences(pseudo, $(data.parentRefresh), $('#search_seq_field').val());
		        $('[data-id="'+data.resid+'"]').each(function () {
	        		if($(this).parent().hasClass('liste_sequence_eleve')){
	        			var pseudoAssignee = $(this).parent().data('pseudo')
			        	var selector = ".liste_sequence_eleve[name=\"" + $(this).parent().attr('name') + "\"]";
			        	// afficheAssignedSequence(pseudo, pseudoAssignee, $(selector));
			        	refreshRessourceCarousel(resType.sequence, $(selector));
	        		}
	           	})
	        	break;

	        case "SEQUENCE_DETAIL" :
	        	$(data.parentRefresh+"[data-index='"+$(data.parentRefresh).data('index')+"']").each(function(){
	        		// afficheExoSequence(pseudo, data.seqid, $(this));
	        		refreshRessourceCarousel(resType.exercice, $(this));
	        	})
	        	break;

	        case resType.exercice  :
	        case resType.fiche :
	        case resType.image :
	        case resType.video :
	        case resType.audio :
	        	refreshRessourceCarousel(data.type, $(data.parentRefresh));
	        	afficheAllExoSequence();
	        	break;

	        // case resType.exercice  :
	        // 	afficheMesExercices(pseudo, $(data.parentRefresh), $('#search_field').val());
	        // 	afficheAllExoSequence();
	        // 	break;

	        // case resType.fiche :
	        // 	afficheMesFiches(pseudo, $(data.parentRefresh), $('#search_field').val());
	        // 	afficheAllExoSequence();
	        // 	break;

	        // case resType.image :
	        // 	afficheMesImages(pseudo, $(data.parentRefresh), $('#search_field').val());
	        // 	afficheAllExoSequence();
	        // 	break;

	        // case resType.video :
	        // 	afficheMesVideo(pseudo, $(data.parentRefresh), $('#search_field').val());
	        // 	afficheAllExoSequence();
	        // 	break;

	        // case resType.audio :
	        // 	afficheMesAudio(pseudo, $(data.parentRefresh), $('#search_field').val());
	        // 	afficheAllExoSequence();
	        // 	break;

	        default :
	        	console.log("don't know what to refresh : " + data.type);
	        	break;

        } // end switch

	}

	var callBackAffEleve = function(data){

		console.log('ok => appel callBackAffEleve => data :');
		console.log(data);

		switch (data.type) {

	        case "ELEVE" :
				afficheListeClasse("#mesEleves", userType.eleve);
				break;
				
	        case "ASSIGNED_SEQ" :
	        	var pseudoAssignee = data.pseudo;
	        	var selector = ".liste_sequence_eleve[name=\"" + data.parentRefresh + "\"]";
	        	afficheAssignedSequence(pseudo, pseudoAssignee, $(selector));
	        	break;

	        default :
	        	console.log("don't know what to refresh : " + data.type);
	        	break;

	    }//end switch
	}


	/**
	 *	
	 */
	var dragEndRessource = function(event, element) {
		
		var ressource;
		if(element) ressource = $(element).parents('.rightBar_ressource');
		else ressource = $(this);

		ressource.parent().css('opacity', '1');

	}; // end of dragEndRessource


	var initRessourceDragging = function(type) {
		//var draggedElement;

		//no tactile
		// $('.draggable_'+type).off({
		// 	dragstart: dragStartRessource,
		// 	dragenter: dragEnterRessource,
		// 	dragleave: dragLeaveRessource,
		// 	dragover: dragOverRessource,
		// 	drop: dropRessource,
		// 	dragend : dragEndRessource
		// });
		// $('.draggable_'+type).on({
		// 	dragstart: dragStartRessource,
		// 	dragenter: dragEnterRessource,
		// 	dragleave: dragLeaveRessource,
		// 	dragover: dragOverRessource,
		// 	drop: dropRessource,
		// 	dragend : dragEndRessource
		// });

		$('.draggable_'+type+" img").draggable({ 
			revert: true,
			opacity: 0.5,
			appendTo: "body",
			helper:'clone',
			scroll:false,
			"start" : function(event, ui){
				ui.helper[0].name = dragStartRessource(event, this);
			},
			"stop": function(event, ui){
				dragEndRessource(event, this);
			}
		});

		$('.draggable_'+type).droppable({
			"over" : function(event, ui){
				dragEnterRessource(event, this);
			},
			"out" : function(event, ui){
				dragLeaveRessource(event, this);
			},
			"drop" : function(event, ui){
	 	     	dropRessource(event, this, ui.helper[0].name);
	 	     	dragEndRessource(event, ui.helper.context);
	 	     	$(ui.helper[0]).remove();
	 	    }
	 	});

	}; // end of initSequenceDragging



//==================================================>
//Fin des options du drag & drop ===================>
//==================================================>
