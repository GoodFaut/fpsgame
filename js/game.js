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
  
	this.id = id;
  this.selector;
  this.position = { x : null, y : null }
  this.skin = 'terrorist';
  this.size = { width: 0, height: 0 };
  this.gameInstance;
  this.status = 'borning'; // alive, dying, dead, respawn
  this.selector = $('<i class="target '+ this.skin +'" data-target-id="'+ this.id+'" draggable="false"></i>');
  
  this.setPosition = function(x,y){
    this.position.x = x;
    this.position.y = y;
    
    this.selector.css({
      top : y + 'px',
      left : x + 'px'
    });
  }
  
  this.setSize = function(width, height) {
    this.size.width = width;
    this.size.height = height;
    
    this.selector.css({
      'width': width,
      'height': height
    });
  }

  this.die = function(){
		// Animação morte
    this.selector.animate({ marginLeft: -25 }, 10)
		.animate({ marginLeft: 0 }, 50)
		.animate({ marginLeft: 25 }, 10)
		.animate({ marginLeft: 0 }, 50, function(){
			$(this).stop().fadeOut('slow', function(){
				$(this).remove();
			});
		});
    
     this.status = 'dead';
  }

  this.rise = function(){
    
    this.gameInstance.canvas.append( this.selector );
    
    this.selector.animate({
      opacity: 1,
      marginTop: 0
    }, 1000);
    
    this.status = 'alive';
  }
  
}




var Game = function()
{
	var $instance = this;
  
  this.canvas = $('#canvas');
  this.player = new Player();
  this.targets = Array();
	this.status = 'stoped';
  this.respawnTime = 1;
  this.lastRespawnTime;
  this.difficulty = 'easy'; // easy, medium, hard 

  this.bindMouseEvents = function(){
    $instance.canvas.on('click', function(event){
      if( $instance.status == 'running' ){
        $instance.onShot(event);
      } 
    });
  }

  // Ações primárias
	this.init = function(){
  	this.bindMouseEvents();
		this.loadSounds();
  }

	this.startGame = function(){
  	this.status = 'running';
    this.player.shots = 0;
    this.player.kills = 0;
    this.targets = Array();
    this.lastRespawnTime = Date.now();
    this.playGame();
  }

	this.stopGame = function(){
		this.status = 'stoped';
		this.canvas.find('.target').remove();
		clearInterval(this.updateTimeout);
  }
  
  this.pauseGame = function(){ clearInterval(this.updateTimeout); }
  
  this.playGame = function(){ 
    this.updateTimeout = setInterval( this.update , (1000 / 45)); 
  }
  
  // Atualizacao do cenario
	this.update = function(){
    
		// Atualiza os targets
		for(index=0;index<$instance.targets.length;index++){
      target = ( $instance.targets[index] )? $instance.targets[index] : false;
			if( target ){
				if( target.status == "dying" ){
						target.die();
				}
        if( target.status == 'dead' ){
            delete $instance.targets[ index ];
        }
			}
		}
		
		// Respawn a cada 1 segundo
		if( Date.now() - $instance.lastRespawnTime > (1000 * $instance.respawnTime) ){
			$instance.respawn();
		}
		
	}
  
  // Ações segundárias
  this.respawn = function() {
    target = new Target( this.targets.length );
    target.gameInstance = this;
    
    width = Math.random() * (200 - 50) + 50;
    height = width * 2;
    target.setSize(width, height);
    
		posicao_x = Math.floor((Math.random() * (this.canvas.width() - target.size.width)  ) + 1);
    posicao_y = Math.floor((Math.random() * (this.canvas.height() - target.size.height)  ) + 1);
    target.setPosition(posicao_x, posicao_y);
		
    target.rise();
   	
		this.lastRespawnTime = Date.now();
    this.targets.push(target);
  }

  // Eventos
  this.whenHit = function($target) {
  	this.playSoundEffect('death');
    this.player.kills++;
    
    target = this.targets[ $(event.target).data('target-id') ];
    if( target.status == 'alive' ){
		  target.status = 'dying';
    }
  }
  
  this.onMiss = function(){}

  this.onShot = function(event){
    this.player.shots++;
    this.playSoundEffect('shot');
    
    if( $(event.target).hasClass('target') ) {
      this.whenHit( $(event.target) );
    }else{
      this.onMiss();
    }
  }

  // Efeitos
  this.playSoundEffect = function(type) {
    sound = document.getElementById(type);
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }
	
	this.loadSounds = function() {
		this.canvas.append('<audio controls id="shot" preload="auto"><source src="sounds/shot.mp3" type="audio/mpeg"></audio>');
		this.canvas.append('<audio controls id="death" preload="auto"><source src="sounds/death.mp3" type="audio/mpeg"></audio>');
	}

}