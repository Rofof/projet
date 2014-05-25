
	/**
	 *	Affiche les séquences assignées à un élève
	 *
	 *	@param
	 *	@param
	 *	@param
	 */
	var afficheAssignedSequence = function(pseudoProf, pseudoEleve, seqDisplay) {
        var myUrl_Get = cfgWs.prefix+"/platoatic/teach/"+pseudoProf+"/"+pseudoEleve;

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

            	if (seqDisplay.children().eq(-1).hasClass('rightBar_ressource')) {
            		var ressource = true;
            	}else{
            		var ressource = false;
            	}

          		var selecteur = "#tab_"+ pseudoEleve;
          		var param = {
          			"prenom" : $(selecteur).data("inputprenom"),
          			"pseudo" : pseudoEleve,
          			"data" : data,
          			"mode" : "enseignant_detail",
          			"ressource" : ressource
          		};
          		
				// var result = new EJS({url: 'template_classe_seq_assigned.ejs'}).render(param);
				var result = new EJS({url: '/js/ressources/template_ressources_list.ejs'}).render(param);
				
				seqDisplay.html(result);

				// manage draggable sequence 

				initRessourceDragging("eleve");

           	},
            error: function() { 
              	console.log('afficheAssignedSequence : GET process error ');
              	window.location.href = "./index.html";
            }
        }); /* end of ajax call */
	}; // end of afficheAssignedSequence

	/**
	 *	Associe un élève à une classe
	 *
	 *	@param
	 */
	var associeClasseEleve = function(newPseudo) {

        var myUrl_Post = cfgWs.prefix+"/platoatic/group/"+noClasse+"/"+newPseudo;
        console.log(">> ajoutEleve");
        
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

            	console.log ("associeClasseEleve success");
          		
          		afficheListeClasse("#mesEleves", userType.eleve);

           	},

            error: function() {
              console.log('associeClasseEleve POST process error');
              window.location.href = "./index.html";
            }
        });
	}; // end of associeClasseEleve

	/**
	 *	Affiche les informations de l'enseignant
	 */
	var afficheInfoEnseignant = function (mode) {

        afficheListeClasse("#mesClasses", userType.classe, mode);
	    afficheListeClasse("#mesEleves", userType.eleve, mode);

	}; // end of afficheInfoEnseignant

	/**
	 *	Insérer une séquence à un élève
	 *
	 *	@param
	 *	@param
	 *	@param
	 */
	var insertSequence = function(pseudoProf, pseudoAssignee, noSeq, callback) {

        var myUrl_Put = cfgWs.prefix+"/platoatic/teach/"+ pseudoProf + "/" + pseudoAssignee;

        var message = { "noSeq": noSeq, "action":"ASSIGN"}; 

        $.ajax({
            url: myUrl_Put,
            type: "PUT",
            dataType: "json",
            data: message, 
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},

            success: function(data) {
              
	            console.log("assign sequence succeeded !!!" + data.result);
	            if (callback) callback();
	    //         if (data.result == "success") {
					// var selector = ".liste_sequence_eleve[name=\"" + pseudoAssignee + "\"]";						
					// afficheAssignedSequence(pseudoProf, pseudoAssignee, $(selector));
					// console.log('success insertSequence');
	    //         }
           	},

            error: function() {
              	console.log('PUT process error during sequence insertion');
              	window.location.href = "./signin.php";
            }
        }); // end of ajax request
	}; // end of insertSequence

	/**
	 *	Ne plus assigner une ressource
	 *
	 *	@param
	 *	@param
	 *	@param
	 */
	var unassignRessource = function(pseudoProf, pseudoAssignee, noSeq, callback) {

		console.log("unassignRessource : ");
		var myUrl_Put = cfgWs.prefix+"/platoatic/teach/"+ pseudoProf + "/" + pseudoAssignee;

        var message = { "noSeq": noSeq, "action":"UNASSIGN"}; 

        $.ajax({
            url: myUrl_Put,
            type: "PUT",
            dataType: "json",
            data: message, 
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},

            success: function(data) {
              
	            console.log("unassign sequence succeeded !!!" + data.result);
	            
	            if (data.result == "success") {
					var selector = ".liste_sequence_eleve[name=\"" + pseudoAssignee + "\"]";						
					afficheAssignedSequence(pseudoProf, pseudoAssignee, $(selector));
	            }

	            if(callback) callback();
           	},

            error: function() {
              	console.log('PUT process error during sequence insertion');
              	window.location.href = "./signin.php";
            }
        }); // end of ajax request
	}; // end of unassignRessource


	/**
	 *	Permet l'ajout d'un élève
	 */
	var ajoutEleve = function() {

		//Variable pour le pseudo
		var classPseudo = ".for-pseudo";
		var PseudoSubmit = "#inputPseudo";

        //Variables pour le pass 1
        var idPass1 = "inputPassword";
        var classMsg1 = "for-pwd";

        //Variables pour le pass 2
        var idPass2 = "inputPasswordVerif";
        var classMsg2 = "for-pwd-verif";
        var idModal = "ajoutEleveModal";

        if(regexPassword(idPass1,classMsg1)){

	        if(verifPassword(idPass1, idPass2, classMsg2)){
	        	
		        var myUrl_Post = cfgWs.prefix+"/platoatic/users";
		        var message = {"pseudo": $('#inputPseudo').val(), "nom": $('#inputNom').val(), "prenom": $('#inputPrenom').val(), "pw": $('#inputPassword').val()}; 

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

		            	if(data.result=="success"){
		            		console.log ("ajoutEleve success");
		            		$(classPseudo).html("");
		            		$(PseudoSubmit).attr("style","");
		            		$("#"+idModal).modal('hide');
		              		associeClasseEleve($('#inputPseudo').val());
		              		effacerForm("ajout_eleve_form");
		            	}else{
		            		$(classPseudo).html("Ce pseudo est déjà utilisé.<br/>Merci d'en choisir un nouveau.");
        					$(classPseudo).attr('style', 'color: rgb(132, 53, 52);');
        					$(PseudoSubmit).attr('style', 'box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset, 0px 0px 6px rgb(206, 132, 131); border-color: rgb(132, 53, 52);');
		            		console.log ("login eleve already exists");
		            	}
		            	
		           	},

		            error: function() {
		              console.log('ajoutEleve POST process error');
		              window.location.href = "./index.html";
		            }

		        });
	        }
        }

	}; // end of ajoutEleve

	/**
	 *	Permet de voir les infos du user
	 *
	 *	@param
	 *	@param
	 *	@param
	 *	@param
	 */
	var showInfoUser = function(pseudoUser, nameUser, lastnameUser, typeUser) {
		//console.log("OK entre!");
		//Réinitialisation des champs / style
		$("#inputPasswordModif").attr("style", "");
		$("#inputPasswordVerifModif").attr("style", "");
		$('.for-pwd-modif').html('');
		$('.for-pwd-verif-modif').html('');
		$('#inputPasswordModif').val('');
		$('#inputPasswordVerifModif').val('');

		//Reiseignement des champs
		$('#modifUserModal').modal('show');
		$('#inputNomModif').val(nameUser);
		$('#inputPrenomModif').val(lastnameUser);
		$('#inputPseudoModif').val(pseudoUser);
		$('#inputTypeModif').val(typeUser);

	};

	//Bouton pour modifier les 
	$('#modif_eleve_btn').click(function(event) {

		event.preventDefault();
		
		var idInputNom = "#inputNomModif";
		var idInputPrenom = "#inputPrenomModif";
		var idInputPass = "#inputPasswordModif";
		var idInputType = "#inputTypeModif";
		var idInputPseudo = "#inputPseudoModif";
		modifyUser(idInputNom, idInputPrenom, idInputPass, idInputType, idInputPseudo);

	}); // end of handler ajout eleve button

	$('#annul_modif').click(function() {

		$('#modifUserModal').modal('hide');		

		$("#modalGestion").modal('hide');

		});

	/**
	 *	Regex pour le mot de passe
	 *
	 *	@param
	 *	@param
	 */
	var regexPassword = function(idSubmit, classMsg) {

		var regex = /^[A-Za-z0-9]{3,18}$/;
		var regexMsg = "Le mot de passe doit contenir de 3 à 18 lettres ou chiffres."

		if($("#"+idSubmit).val().match(regex)){
			$("."+classMsg).html("");
			$("#"+idSubmit).attr("style", "");

			return true;
		}
		else{
			$("#"+idSubmit).attr('style', 'box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset, 0px 0px 6px rgb(206, 132, 131); border-color: rgb(132, 53, 52);');
        	$("."+classMsg).html(regexMsg);
        	$("."+classMsg).attr('style', 'color: rgb(132, 53, 52);');

        	return false;
		}

	}// enf of regexPassword

	/**
	 *	Vérifie le mot de passe saisie
	 *
	 *	@param
	 *	@param
	 *	@param
	 *	@param
	 */
	var verifPassword = function(idPass1, idPass2, classMsg, idModal) {
		
		if($("#"+idPass1).val() == $("#"+idPass2).val()){
			$("."+classMsg).html("");
			$("#"+idPass2).attr("style", "");
			if(idModal){
				$("#"+idModal).modal('hide');
			}

	        return true;
		}
		else{
			$("."+classMsg).html("les mots de passe renseignés ne sont pas identiques.");
        	$("."+classMsg).attr('style', 'color: rgb(132, 53, 52);');
        	$("#"+idPass2).attr('style', 'box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset, 0px 0px 6px rgb(206, 132, 131); border-color: rgb(132, 53, 52);');

        	return false;
		}

	}// end of verifPassword

	/**
	 *	Modifie les infos de l'utilisateur
	 *
	 *	@param
	 *	@param
	 *	@param
	 *	@param
	 *	@param
	 */
	var modifyUser = function(idInputNom, idInputPrenom, idInputPass, idInputType, idInputPseudo) {

		//Variables pour le pass 1
        var idPass1 = "inputPasswordModif";
        var classMsg1 = "for-pwd-modif";

        //Variables pour le pass 2
        var idPass2 = "inputPasswordVerifModif";
        var classMsg2 = "for-pwd-verif-modif";
        var idModal = "modifUserModal";

        //Pseudo
        var pseudoUser = $(idInputPseudo).val();

		if(regexPassword(idPass1,classMsg1)){

			if(verifPassword(idPass1, idPass2, classMsg2, idModal)){

				var myUrl_Post = cfgWs.prefix+"/platoatic/users/"+pseudoUser;

		        var message = {"nom":$(idInputNom).val(), "prenom":$(idInputPrenom).val(), "pw":$(idInputPass).val(), "type":$(idInputType).val()};

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

		            	if (pseudoUser == pseudo)
		            		updateSessionUserInfo($(idInputNom).val(), $(idInputPrenom).val());
		            	else {
		            	   	console.log ("modifEleve success");
		            		afficheListeClasse("#mesEleves", userType.eleve);
		            	}
		           	},

		            error: function() {
		              console.log('modifEleve POST process error');
		              window.location.href = "./index.html";
		            }

		        });
			};
		};
	};//end modif user

	/**
	 *	Permet la suppression d'un élève
	 *
	 *	@param eleveid Integer	identifiant de l'élève à supprimer
	 */
	var removeEleve = function(eleveid, callback){

		var myUrl_Post = cfgWs.prefix+"/platoatic/users/"+eleveid;
        var message = "na";

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

            	console.log ('supprEleve success');
	            if(callback) callback();

            	// afficheListeClasse("#mesEleves", userType.eleve);
           	},

            error: function() {
              console.log('supprEleve DELETE process error');
              window.location.href = "./index.html";
            }

        });
	}//end removeEleve


		/**
	 *	Permet d'activer ou désactiver une classe
	 *
	 *	@param pseudoProf string identifiant du professeur de la classe
	 *	@param noClasse	 string	identifiant de la classe à activer / désactiver
	 *	@param activated Boolean indiquant s'il faut activer ou désactiver la classe/
	 */
	var activateClasse = function(pseudoProf, noClasse, activated, callback){

		var myUrl_Post = cfgWs.prefix+"/platoatic/teach/"+pseudoProf+ "/"+ noClasse;
        console.log(">> supprEleve");
        var message = {
        	"action" : "ACTIVATE",
        	"activated" : activated
        };

        $.ajax({
            url: myUrl_Post,
            type: "post",
            dataType: "json",
            data: message,
            cache: false,
            timeout: 5000,
            //crossDomain: true,
      		xhrFields: {
        		withCredentials : true
      		},

            success: function(data) {
            	callback();
           	},

            error: function() {
              console.log('activateClasse POST process error');
              window.location.href = "./index.html";
            }
        });
	}//end activateClasse