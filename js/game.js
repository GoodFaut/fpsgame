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

var Target = function() {
  $instance = this;
  
  $instance.selector;
  $instance.position = { x : null, y : null }
  $instance.skin = 'terrorist';
  $instance.id;
  $instance.size = { height: 200, width: 100 }
  $instance.gameInstance;
  
  this.setPosition = function(x,y){
    $instance.position.x = x;
    $instance.position.y = y;
    
    $instance.selector.css({
      top : y + 'px',
      left : x + 'px'
    });
  }

  this.die = function(){
    $instance.selector.addClass('dead');
  }

  this.rise = function(){}
  
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
      $instance.onKill( $(event.target) );
    }else{
      $instance.onMiss();
    }
    
  }

  this.respawn = function() {
    target_id =  $instance.targets.length;

    target = new Target();
    target.gameInstance = $instance;
    target.skin = 'terrorist';
    target.id = target_id;
    target.selector = $('<i class="target '+ target.skin +'" data-target-id="'+target.id+'" draggable="false"></i>');
    
    posicao_x = Math.floor((Math.random() * ($instance.canvas.width() - target.size.width)  ) + 1);
    posicao_y = Math.floor((Math.random() * ($instance.canvas.height() - target.size.height)  ) + 1);
    target.setPosition(posicao_x, posicao_y);
    
    $instance.canvas.append( target.selector );
    $instance.targets.push(target);
  }

  // Eventos
  this.onKill = function($target) {
    $instance.playSoundEffect('death');
    $instance.targets[ $(event.target).data('target-id') ].die();
    $instance.player.kills++;

    delete $instance.targets[ $target.data('target-id') ];
    
    $instance.respawn();
  }
  
  this.onMiss = function(){}


  // Efeitos
  this.playSoundEffect = function(type)
  {
    sound = document.getElementById(type);
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

}