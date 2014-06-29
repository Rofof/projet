

var displayCorrectionList = function(modalId, tabRef, mode, workDone, pseudoEleve, noExo) {
	
	// console.log(modalId+", "+tabRef+", "+mode+", "+workDone+", "+pseudoEleve+", "+noExo)

	if (mode == 'eleve') {
		var input = {
			'filter' : {'pseudo' : pseudoEleve, 'noExo': noExo},
			'workDone' : workDone
		};
		// console.log(input)
		var result = new EJS({url: './js/correction/template_work_done.ejs'}).render(input);
		
		if (modalId != null) {
			$('#body_'+modalId).html(result);
			$('#'+modalId).modal('show');
		}
		else {
			tabRef.html(result);
		}
	}
	else {

		// go through the received information for the whole group and prepare the table.

		var workTable = [];
		var exoList = {};
		var element = null;
		var currentId = null;
		for (var i=0; i<workDone.length; i++) {
			if ((element==null)||(element.noEleve!=workDone[i].noEleve)) {
				// infotmation sur nouvel élève --> nouvelle ligne
				element = {};
				element.noEleve = workDone[i].noEleve;
				element.identifiant = workDone[i].identifiant;
				element.nom = workDone[i].nom;
				element.prenom = workDone[i].prenom;
				element.listeExos = {}
				element.listeExos[workDone[i].id] = {
					'id' : workDone[i].id,
					'url' : workDone[i].url,
					'title' : workDone[i].title,
					'note' : workDone[i].note,
					'dataTravail' : workDone[i].dataTravail
				}
				exoList[workDone[i].id] = workDone[i].title;
				workTable.push(element);
				currentId = workDone[i].id;
			}
			else if (currentId != workDone[i].id) {
				element.listeExos[workDone[i].id] = {
					'id' : workDone[i].id,
					'url' : workDone[i].url,
					'title' : workDone[i].title,
					'note' : workDone[i].note,
					'dataTravail' : workDone[i].dataTravail
				}
				exoList[workDone[i].id] = workDone[i].title;
				currentId = workDone[i].id;
			}
		} // end of for on workDone elements


		var input = {
			'exoList' : exoList,
			'workTable' : workTable
		};

		var result = new EJS({url: './js/correction/template_work_done_group.ejs'}).render(input);
		
		if (modalId != null) {
			$('#body_'+modalId).html(result);

			$('#'+modalId).modal('show');
		}
		else {
			//$('#'+tabRef).html(result);
			//console.log(tabRef);
			tabRef.html(result);
		}

	}

} // end of displayCorrectionList


/**
* noTravail ; l'id tu travail à récupérer ou TRAVAUX pour récupérer tous les travaux du contexte pseudoEleve, pseudoProf
**/
var retrieveWorkDone = function(pseudoEleve, pseudoProf, noTravail, callback) {
	var myUrl_Get = cfgWs.prefix+"/platoatic/study/"+pseudoEleve+"/"+pseudoProf+"/" + noTravail;

	$.ajax({
	    url: myUrl_Get,
	    type: "GET",
	    dataType: "json",
	    //crossDomain: true,
        xhrFields: {
        	withCredentials : true
        },        
	    success: function(data) {

	      	callback(data.workDone);

	    },
	    error: function() {
	        console.log('retrieveWorkDone : GET process error ');
	        callback(null);
	    }
	}); /* end of ajax call */

} // end of retrieveWorkDone 

var displayExerciceWorkDone = function (pseudo, noExo) {

	displayCorrectionList('correctionModal', null, 'eleve', workDone, pseudo, noExo);
	
} // end of displayExerciceWorkDone