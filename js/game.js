var Player = function()
{
	var name;
  var shots = 0;
  var kills = 0;

	this.setName = function(name) {
		this.name = name;
	}

	this.getName = function() {
		return this.name;
	}
}

var Target = function( id ) {
  $instance = this;
  
	$instance.id = id;
  $instance.selector;
  $instance.position = { x : null, y : null }
  $instance.skin = 'terrorist';
  $instance.size = { height: 200, width: 100 }
  $instance.gameInstance;
  $instance.status = 'alive';
  
  this.setPosition = function(x,y){
    $instance.position.x = x;
    $instance.position.y = y;
    
    $instance.selector.css({
      top : y + 'px',
      left : x + 'px'
    });
  }

  this.die = function(){
		// Animação morte
    $instance.selector.animate({ marginLeft: -25 }, 10)
		.animate({ marginLeft: 0 }, 50)
		.animate({ marginLeft: 25 }, 10)
		.animate({ marginLeft: 0 }, 50, function(){
			$(this).stop().fadeOut('slow', function(){
				$(this).remove();
			});
		});
		
    $instance.status = 'dead';
  }

  this.rise = function(){
	 	$instance.selector = $('<i class="target '+ $instance.skin +'" data-target-id="'+$instance.id+'" draggable="false"></i>');
    
		posicao_x = Math.floor((Math.random() * ($instance.gameInstance.canvas.width() - $instance.size.width)  ) + 1);
    posicao_y = Math.floor((Math.random() * ($instance.gameInstance.canvas.height() - $instance.size.height)  ) + 1);
    $instance.setPosition(posicao_x, posicao_y);
		
    $instance.gameInstance.canvas.append( $instance.selector );
    $instance.selector.addClass('rise');
  }
  
}

var Game = function()
{
	var $instance = this;
  $instance.canvas = $('#canvas');
  $instance.player = new Player();
  $instance.started = false;
  $instance.ended = false;
  $instance.targets = Array();

  this.bindMouseEvents = function(){
    $instance.canvas.on('click', function(event){
      if( $instance.started == true && $instance.ended == false ){
        $instance.shot(event);
      } 
    });
  }

  // Ações primárias

	this.init = function(){
  	$instance.bindMouseEvents();
		$instance.loadSounds();
  }

	this.start = function(){
  	$instance.started = true;
    $instance.player.shots = 0;
    $instance.player.kills = 0;
    $instance.targets = Array();
    $instance.targets.count = 0
    $instance.updateTimeout = setInterval( $instance.update , 1000);
    $instance.respawn();
    
  }

	this.stop = function(){
		$instance.canvas.find('.target').remove();
  }

	this.update = function(){}
  
  // Ações segundárias
  this.shot = function(event){
    $instance.player.shots++;
    $instance.playSoundEffect('shot');
    
    if( $(event.target).hasClass('target') ) {
      $instance.whenHit( $(event.target) );
    }else{
      $instance.onMiss();
    }
    
  }

  this.respawn = function() {
    target = new Target( $instance.targets.length );
    target.gameInstance = $instance;
    target.skin = 'terrorist';
   
    target.rise();
   
    $instance.targets.push(target);
  }

  // Eventos
  this.whenHit = function($target) {
    $instance.playSoundEffect('death');
    $instance.targets[ $(event.target).data('target-id') ].die();
    $instance.player.kills++;

    delete $instance.targets[ $target.data('target-id') ];
    
    $instance.respawn();
  }
  
  this.onMiss = function(){}


  // Efeitos
  this.playSoundEffect = function(type) {
    sound = document.getElementById(type);
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }
	
	this.loadSounds = function() {
		$instance.canvas.append('<audio controls id="shot" preload="auto"><source src="sounds/shot.mp3" type="audio/mpeg"></audio>');
		$instance.canvas.append('<audio controls id="death" preload="auto"><source src="sounds/death.mp3" type="audio/mpeg"></audio>');
	}

}