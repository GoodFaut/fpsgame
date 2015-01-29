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
  
  this.setPosition = function(x,y){
    $instance.position.x = x;
    $instance.position.y = y;
    
    $instance.selector.css({
      top : y + 'px',
      left : x + 'px'
    });
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
    $instance.createTarget();
    
  }

	this.stop = function(){
		$instance.canvas.find('.target').remove();
  }

	this.update = function(){
    
	}
    
  this.shot = function(event){
    $instance.player.shots++;
    
    if( $(event.target).hasClass('target') ) {
      $instance.onKill( $(event.target) );
    }else{
      $instance.onMiss();
    }
    
  }
  
  this.onKill = function($target) {
    $target.addClass('dead');
    delete $instance.targets[$target.data('target-id')];
    setTimeout( function(){ $target.remove() }, 500 );
    
    $instance.player.kills++;
    $instance.targets.length--;
    $instance.createTarget();
  }
  
  this.onMiss = function(){
    
  }
  
  this.createTarget = function() {
    target_id =  $instance.targets.count;
    target = new Target();
    target.skin = 'terrorist';
    target.id = target_id;
    target.selector = $('<i class="target '+ target.skin +'" data-target-id="'+target.id+'" draggable="false"></i>');
    
    posicao_x = Math.floor((Math.random() * ($instance.canvas.width() - target.size.width)  ) + 1);
    posicao_y = Math.floor((Math.random() * ($instance.canvas.height() - target.size.height)  ) + 1);
    target.setPosition(posicao_x, posicao_y);
    
    $instance.canvas.append( target.selector );
    $instance.targets.push(target);
    $instance.targets.count++;
  }
    
  this.bindMouseEvents = function(){
    $instance.canvas.on('click', function(event){
      if( $instance.started == true && $instance.ended == false ){
        $instance.shot(event);
      } 
    });
  }

}