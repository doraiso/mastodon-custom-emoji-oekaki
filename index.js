'use strict';
let Application=function(args){
	this.width=11;
	this.height=11;
};
Application.prototype={

	run: function(args){
		let t=this;
		let wl=window.location.search.substring(1);
		if(wl) {
			$('#instance_info_domain').val(wl);
		}
		$('#instance_info_submit').on('click',function() {
			$.get("https://"+$("#instance_info_domain").val()+"/api/v1/custom_emojis",function(json){
				t.emoji_palette(json);
				t.tiles();
				$('.instance_info').hide();
				$('.cont_left').show();
				$('.cont_right').show();
			});
		});

	},

	tiles: function() {
		let t=this;
		t.tiles_sc=[];

		for(let y=0; y<t.height; y++) {
			let scr=[];
			for(let x=0; x<t.width; x++) {
				let blank=$(t.blank_idom).clone();
				blank.css({
					'border':'2px solid #333333',
					'margin':'1px',
				});
				$(blank).attr({
					'data-x':x,
					'data-y':y,
				});
				$('#tiles').append( blank );
				scr[x]='blank';
			}
			$('#tiles').append( $('<br>') );
			t.tiles_sc[y]=scr;
		}
		$('#tiles img').on('click',function(e) {
			let tg=e.target;
			let x=tg.dataset.x, y=tg.dataset.y;
			if(!t.selected_idom) { return }
			if ( tg.src == t.selected_idom.src ) {
				$(tg).attr({ src: t.blank_idom.src });
				t.tiles_sc[y][x]='blank';
			} else {
				$(tg).attr({ src: t.selected_idom.src });
				t.tiles_sc[y][x]=t.selected_idom.dataset.shortcode;
			}
			t.result();
		});
	},

	emoji_palette: function(emoji) {
		let t=this;
		for(let i=0;i<emoji.length;i++) {
		//	console.log(emoji[i]);
			let ijq=$('<img>',{
				src: emoji[i].url,
				'data-shortcode': emoji[i].shortcode,
				css: {
					'border': '2px solid rgb(57, 63, 79)',
					'object-fit': 'contain',
					'width':  32,
					'height': 32,
				},
			});
			$('#emoji_palette').append(ijq);
			if( emoji[i].shortcode == 'blank' ) {
				t.blank_idom=ijq[0];
			}
		}
		$('#emoji_palette img').on('click',function(e) {
			let tg=e.target;
			if (tg == t.selected_idom ) { return; }
	//		console.log(tg.dataset.shortcode);
			$(tg).css('border','2px solid #FFFFFF');
			t.selected_idom=tg;
			if(t.prev_selected_idom) {
				$(t.prev_selected_idom).css('border','2px solid rgb(57, 63, 79)');
			}
			t.prev_selected_idom=tg;
		});
	},

	result: function() {
		let t=this;
		let nr=[];
		let seen_y=false;
		for(let y=t.height-1;y>=0;y--) {
			let nc=[];
			let seen_x=false;
			for(let x=t.width-1;x>=0;x--) {
				let ts=t.tiles_sc[y][x];
				if(ts != 'blank') { seen_x=true }
				if(seen_x) { nc.push(ts) }
			}
			if(nc.length>0) {
				seen_y=true;
			} else {
				nc.push('blank');
			}

			if(seen_y) {
				nr.push(nc.reverse());
			}
		}
		let lines=[];
		for(let y=nr.length-1;y>=0;y--) {
			lines.push(nr[y].map(function(v) { return ":"+v+":" }).join("\u200B"));
		}
		$('#result').val(lines.join("\n"));
	},

};
$(function(){ new Application().run(); });

