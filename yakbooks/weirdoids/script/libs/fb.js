FB.subclass('XFBML.Fan', 'XFBML.IframeWidget', null, {
	_visibleAfter : 'load',
	setupAndValidate : function() {
		this._attr = {
			api_key : FB._apiKey,
			connections : this.getAttribute('connections', '10'),
			css : this.getAttribute('css'),
			height : this._getPxAttribute('height'),
			id : this.getAttribute('profile-id'),
			logobar : this._getBoolAttribute('logo-bar'),
			name : this.getAttribute('name'),
			stream : this._getBoolAttribute('stream', true),
			width : this._getPxAttribute('width', 300)
		};
		if (!this._attr.id && !this._attr.name) {
			FB.log('<fb:fan> requires one of the "id" or "name" attributes.');
			return false;
		}
		var a = this._attr.height;
		if (!a)
			if ((!this._attr.connections || this._attr.connections === '0')
					&& !this._attr.stream) {
				a = 65;
			} else if (!this._attr.connections
					|| this._attr.connections === '0') {
				a = 375;
			} else if (!this._attr.stream) {
				a = 250;
			} else
				a = 550;
		if (this._attr.logobar)
			a += 25;
		this._attr.height = a;
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._attr.height
		};
	},
	getUrlBits : function() {
		return {
			name : 'fan',
			params : this._attr
		};
	}
});
FB.subclass('XFBML.Friendpile', 'XFBML.Facepile', null, {});
FB.subclass('XFBML.EdgeCommentWidget', 'XFBML.IframeWidget', function(a) {
	this._iframeWidth = a.width + 1;
	this._iframeHeight = a.height;
	this._attr = {
		master_frame_name : a.masterFrameName,
		offsetX : a.relativeWidthOffset - a.paddingLeft
	};
	this.dom = a.commentNode;
	this.dom.style.top = a.relativeHeightOffset + 'px';
	this.dom.style.left = a.relativeWidthOffset + 'px';
	this.dom.style.zIndex = FB.XFBML.EdgeCommentWidget.NextZIndex++;
	FB.Dom.addCss(this.dom, 'fb_edge_comment_widget');
}, {
	_visibleAfter : 'load',
	_showLoader : false,
	getSize : function() {
		return {
			width : this._iframeWidth,
			height : this._iframeHeight
		};
	},
	getUrlBits : function() {
		return {
			name : 'comment_widget_shell',
			params : this._attr
		};
	}
});
FB.provide('XFBML.EdgeCommentWidget', {
	NextZIndex : 10000
});
FB
		.subclass(
				'XFBML.EdgeWidget',
				'XFBML.IframeWidget',
				null,
				{
					_visibleAfter : 'immediate',
					_showLoader : false,
					_rootPadding : null,
					setupAndValidate : function() {
						FB.Dom.addCss(this.dom, 'fb_edge_widget_with_comment');
						this._attr = {
							channel_url : this.getChannelUrl(),
							debug : this._getBoolAttribute('debug'),
							href : this.getAttribute('href',
									window.location.href),
							is_permalink : this
									._getBoolAttribute('is-permalink'),
							node_type : this.getAttribute('node-type', 'link'),
							width : this._getWidgetWidth(),
							font : this.getAttribute('font'),
							layout : this._getLayout(),
							colorscheme : this.getAttribute('color-scheme'),
							action : this.getAttribute('action'),
							ref : this.getAttribute('ref'),
							show_faces : this._shouldShowFaces(),
							no_resize : this._getBoolAttribute('no_resize'),
							send : this._getBoolAttribute('send'),
							url_map : this.getAttribute('url_map'),
							extended_social_context : this._getBoolAttribute(
									'extended_social_context', false)
						};
						this._rootPadding = {
							left : parseFloat(FB.Dom.getStyle(this.dom,
									'paddingLeft')),
							top : parseFloat(FB.Dom.getStyle(this.dom,
									'paddingTop'))
						};
						return true;
					},
					oneTimeSetup : function() {
						this.subscribe('xd.authPrompted', FB.bind(
								this._onAuthPrompt, this));
						this.subscribe('xd.edgeCreated', FB.bind(
								this._onEdgeCreate, this));
						this.subscribe('xd.edgeRemoved', FB.bind(
								this._onEdgeRemove, this));
						this
								.subscribe(
										'xd.presentEdgeCommentDialog',
										FB
												.bind(
														this._handleEdgeCommentDialogPresentation,
														this));
						this.subscribe('xd.dismissEdgeCommentDialog', FB.bind(
								this._handleEdgeCommentDialogDismissal, this));
						this.subscribe('xd.hideEdgeCommentDialog', FB.bind(
								this._handleEdgeCommentDialogHide, this));
						this.subscribe('xd.showEdgeCommentDialog', FB.bind(
								this._handleEdgeCommentDialogShow, this));
					},
					getSize : function() {
						return {
							width : this._getWidgetWidth(),
							height : this._getWidgetHeight()
						};
					},
					_getWidgetHeight : function() {
						var a = this._getLayout(), b = this._shouldShowFaces()
								? 'show'
								: 'hide', c = this._getBoolAttribute('send'), d = 65 + (c
								? 25
								: 0), e = {
							standard : {
								show : 80,
								hide : 35
							},
							box_count : {
								show : d,
								hide : d
							},
							button_count : {
								show : 21,
								hide : 21
							},
							simple : {
								show : 20,
								hide : 20
							}
						};
						return e[a][b];
					},
					_getWidgetWidth : function() {
						var a = this._getLayout(), b = this
								._getBoolAttribute('send'), c = this
								._shouldShowFaces() ? 'show' : 'hide', d = (this
								.getAttribute('action') === 'recommend'), e = (d
								? 265
								: 225)
								+ (b ? 60 : 0), f = (d ? 130 : 90)
								+ (b ? 60 : 0), g = this.getAttribute('action') === 'recommend'
								? 100
								: 55, h = this.getAttribute('action') === 'recommend'
								? 90
								: 50, i = {
							standard : {
								show : 450,
								hide : 450
							},
							box_count : {
								show : g,
								hide : g
							},
							button_count : {
								show : f,
								hide : f
							},
							simple : {
								show : h,
								hide : h
							}
						}, j = i[a][c], k = this._getPxAttribute('width', j), l = {
							standard : {
								min : e,
								max : 900
							},
							box_count : {
								min : g,
								max : 900
							},
							button_count : {
								min : f,
								max : 900
							},
							simple : {
								min : 49,
								max : 900
							}
						};
						if (k < l[a].min) {
							k = l[a].min;
						} else if (k > l[a].max)
							k = l[a].max;
						return k;
					},
					_getLayout : function() {
						return this._getAttributeFromList('layout', 'standard',
								['standard', 'button_count', 'box_count',
										'simple']);
					},
					_shouldShowFaces : function() {
						return this._getLayout() === 'standard'
								&& this._getBoolAttribute('show-faces', true);
					},
					_handleEdgeCommentDialogPresentation : function(a) {
						if (!this.isValid())
							return;
						var b = document.createElement('span');
						this._commentSlave = this
								._createEdgeCommentWidget(a, b);
						this.dom.appendChild(b);
						this._commentSlave.process();
						this._commentWidgetNode = b;
					},
					_createEdgeCommentWidget : function(a, b) {
						var c = {
							commentNode : b,
							externalUrl : a.externalURL,
							masterFrameName : a.masterFrameName,
							layout : this._getLayout(),
							relativeHeightOffset : this._getHeightOffset(a),
							relativeWidthOffset : this._getWidthOffset(a),
							anchorTargetX : parseFloat(a['query[anchorTargetX]'])
									+ this._rootPadding.left,
							anchorTargetY : parseFloat(a['query[anchorTargetY]'])
									+ this._rootPadding.top,
							width : parseFloat(a.width),
							height : parseFloat(a.height),
							paddingLeft : this._rootPadding.left
						};
						return new FB.XFBML.EdgeCommentWidget(c);
					},
					_getHeightOffset : function(a) {
						return parseFloat(a['anchorGeometry[y]'])
								+ parseFloat(a['anchorPosition[y]'])
								+ this._rootPadding.top;
					},
					_getWidthOffset : function(a) {
						var b = parseFloat(a['anchorPosition[x]'])
								+ this._rootPadding.left, c = FB.Dom
								.getPosition(this.dom).x, d = this.dom.offsetWidth, e = FB.Dom
								.getViewportInfo().width, f = parseFloat(a.width), g = false;
						if (FB._localeIsRtl) {
							g = f < c;
						} else if ((c + f) > e)
							g = true;
						if (g)
							b += parseFloat(a['anchorGeometry[x]']) - f;
						return b;
					},
					_getCommonEdgeCommentWidgetOpts : function(a, b) {
						return {
							colorscheme : this._attr.colorscheme,
							commentNode : b,
							controllerID : a.controllerID,
							nodeImageURL : a.nodeImageURL,
							nodeRef : this._attr.ref,
							nodeTitle : a.nodeTitle,
							nodeURL : a.nodeURL,
							nodeSummary : a.nodeSummary,
							width : parseFloat(a.width),
							height : parseFloat(a.height),
							relativeHeightOffset : this._getHeightOffset(a),
							relativeWidthOffset : this._getWidthOffset(a),
							error : a.error,
							siderender : a.siderender,
							extended_social_context : a.extended_social_context,
							anchorTargetX : parseFloat(a['query[anchorTargetX]'])
									+ this._rootPadding.left,
							anchorTargetY : parseFloat(a['query[anchorTargetY]'])
									+ this._rootPadding.top
						};
					},
					_handleEdgeCommentDialogDismissal : function(a) {
						if (this._commentWidgetNode) {
							this.dom.removeChild(this._commentWidgetNode);
							delete this._commentWidgetNode;
						}
					},
					_handleEdgeCommentDialogHide : function() {
						if (this._commentWidgetNode)
							this._commentWidgetNode.style.display = "none";
					},
					_handleEdgeCommentDialogShow : function() {
						if (this._commentWidgetNode)
							this._commentWidgetNode.style.display = "block";
					},
					_fireEventAndInvokeHandler : function(a, b) {
						FB.Helper.fireEvent(a, this);
						FB.Helper.invokeHandler(this.getAttribute(b), this,
								[this._attr.href]);
					},
					_onEdgeCreate : function() {
						this._fireEventAndInvokeHandler('edge.create',
								'on-create');
					},
					_onEdgeRemove : function() {
						this._fireEventAndInvokeHandler('edge.remove',
								'on-remove');
					},
					_onAuthPrompt : function() {
						this._fireEventAndInvokeHandler('auth.prompt',
								'on-prompt');
					}
				});
FB.subclass('XFBML.SendButtonFormWidget', 'XFBML.EdgeCommentWidget',
		function(a) {
			this._base(a);
			FB.Dom.addCss(this.dom, 'fb_send_button_form_widget');
			FB.Dom.addCss(this.dom, a.colorscheme);
			FB.Dom.addCss(this.dom,
					(typeof a.siderender != 'undefined' && a.siderender)
							? 'siderender'
							: '');
			this._attr.nodeImageURL = a.nodeImageURL;
			this._attr.nodeRef = a.nodeRef;
			this._attr.nodeTitle = a.nodeTitle;
			this._attr.nodeURL = a.nodeURL;
			this._attr.nodeSummary = a.nodeSummary;
			this._attr.offsetX = a.relativeWidthOffset;
			this._attr.offsetY = a.relativeHeightOffset;
			this._attr.anchorTargetX = a.anchorTargetX;
			this._attr.anchorTargetY = a.anchorTargetY;
			this._attr.channel = this.getChannelUrl();
			this._attr.controllerID = a.controllerID;
			this._attr.colorscheme = a.colorscheme;
			this._attr.error = a.error;
			this._attr.siderender = a.siderender;
			this._attr.extended_social_context = a.extended_social_context;
		}, {
			_showLoader : true,
			getUrlBits : function() {
				return {
					name : 'send_button_form_shell',
					params : this._attr
				};
			},
			oneTimeSetup : function() {
				this.subscribe('xd.messageSent', FB.bind(this._onMessageSent,
						this));
			},
			_onMessageSent : function() {
				FB.Event.fire('message.send', this._attr.nodeURL, this);
			}
		});
FB.subclass('XFBML.Send', 'XFBML.EdgeWidget', null, {
	setupAndValidate : function() {
		FB.Dom.addCss(this.dom, 'fb_edge_widget_with_comment');
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			font : this.getAttribute('font'),
			colorscheme : this.getAttribute('colorscheme', 'light'),
			href : this.getAttribute('href', window.location.href),
			ref : this.getAttribute('ref'),
			extended_social_context : this.getAttribute(
					'extended_social_context', false)
		};
		this._rootPadding = {
			left : parseFloat(FB.Dom.getStyle(this.dom, 'paddingLeft')),
			top : parseFloat(FB.Dom.getStyle(this.dom, 'paddingTop'))
		};
		return true;
	},
	getUrlBits : function() {
		return {
			name : 'send',
			params : this._attr
		};
	},
	_createEdgeCommentWidget : function(a, b) {
		var c = this._getCommonEdgeCommentWidgetOpts(a, b);
		return new FB.XFBML.SendButtonFormWidget(c);
	},
	getSize : function() {
		return {
			width : FB.XFBML.Send.Dimensions.width,
			height : FB.XFBML.Send.Dimensions.height
		};
	}
});
FB.provide('XFBML.Send', {
	Dimensions : {
		width : 80,
		height : 25
	}
});
FB.subclass('XFBML.Like', 'XFBML.EdgeWidget', null, {
	_widgetPipeEnabled : true,
	getUrlBits : function() {
		return {
			name : 'like',
			params : this._attr
		};
	},
	_createEdgeCommentWidget : function(a, b) {
		if ('send' in this._attr && 'widget_type' in a
				&& a.widget_type == 'send') {
			var c = this._getCommonEdgeCommentWidgetOpts(a, b);
			return new FB.XFBML.SendButtonFormWidget(c);
		} else
			return this._callBase("_createEdgeCommentWidget", a, b);
	},
	getIframeTitle : function() {
		return 'Like this content on Facebook.';
	}
});
FB
		.subclass(
				'XFBML.LikeBox',
				'XFBML.EdgeWidget',
				null,
				{
					_visibleAfter : 'load',
					setupAndValidate : function() {
						this._attr = {
							channel : this.getChannelUrl(),
							api_key : FB._apiKey,
							connections : this.getAttribute('connections'),
							css : this.getAttribute('css'),
							height : this.getAttribute('height'),
							id : this.getAttribute('profile-id'),
							header : this._getBoolAttribute('header', true),
							name : this.getAttribute('name'),
							show_faces : this._getBoolAttribute('show-faces',
									true),
							stream : this._getBoolAttribute('stream', true),
							width : this._getPxAttribute('width', 300),
							href : this.getAttribute('href'),
							colorscheme : this.getAttribute('colorscheme',
									'light'),
							border_color : this.getAttribute('border_color')
						};
						if (this._getBoolAttribute('force_wall', false))
							this._attr.force_wall = true;
						if (this._attr.connections === '0') {
							this._attr.show_faces = false;
						} else if (this._attr.connections)
							this._attr.show_faces = true;
						if (!this._attr.id && !this._attr.name
								&& !this._attr.href) {
							FB
									.log('<fb:like-box> requires one of the "id" or "name" attributes.');
							return false;
						}
						var a = this._attr.height;
						if (!a)
							if (!this._attr.show_faces && !this._attr.stream) {
								a = 62;
							} else {
								a = 95;
								if (this._attr.show_faces)
									a += 163;
								if (this._attr.stream)
									a += 300;
								if (this._attr.header
										&& this._attr.header !== '0')
									a += 32;
							}
						this._attr.height = a;
						this.subscribe('xd.likeboxLiked', FB.bind(
								this._onLiked, this));
						this.subscribe('xd.likeboxUnliked', FB.bind(
								this._onUnliked, this));
						return true;
					},
					getSize : function() {
						return {
							width : this._attr.width,
							height : this._attr.height
						};
					},
					getUrlBits : function() {
						return {
							name : 'likebox',
							params : this._attr
						};
					},
					_onLiked : function() {
						FB.Helper.fireEvent('edge.create', this);
					},
					_onUnliked : function() {
						FB.Helper.fireEvent('edge.remove', this);
					}
				});
FB.subclass('XFBML.LiveStream', 'XFBML.IframeWidget', null, {
	_visibleAfter : 'load',
	setupAndValidate : function() {
		this._attr = {
			app_id : this.getAttribute('event-app-id'),
			height : this._getPxAttribute('height', 500),
			hideFriendsTab : this.getAttribute('hide-friends-tab'),
			redesigned : this._getBoolAttribute('redesigned-stream'),
			width : this._getPxAttribute('width', 400),
			xid : this.getAttribute('xid', 'default'),
			always_post_to_friends : this
					._getBoolAttribute('always-post-to-friends'),
			via_url : this.getAttribute('via_url')
		};
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._attr.height
		};
	},
	getUrlBits : function() {
		var a = this._attr.redesigned ? 'live_stream_box' : 'livefeed';
		if (this._getBoolAttribute('modern', false))
			a = 'live_stream';
		return {
			name : a,
			params : this._attr
		};
	}
});
FB.subclass('XFBML.Login', 'XFBML.Facepile', null, {
	_visibleAfter : 'load',
	getSize : function() {
		return {
			width : this._attr.width,
			height : 94
		};
	},
	getUrlBits : function() {
		return {
			name : 'login',
			params : this._attr
		};
	}
});
FB
		.subclass(
				'XFBML.LoginButton',
				'XFBML.ButtonElement',
				null,
				{
					setupAndValidate : function() {
						if (this._alreadySetup)
							return true;
						this._alreadySetup = true;
						this._attr = {
							autologoutlink : this
									._getBoolAttribute('auto-logout-link'),
							length : this._getAttributeFromList('length',
									'short', ['long', 'short']),
							onlogin : this.getAttribute('on-login'),
							perms : this.getAttribute('perms'),
							scope : this.getAttribute('scope'),
							registration_url : this
									.getAttribute('registration-url'),
							status : 'unknown'
						};
						if (this._attr.autologoutlink)
							FB.Event.subscribe('auth.statusChange', FB.bind(
									this.process, this));
						if (this._attr.registration_url) {
							FB.Event.subscribe('auth.statusChange', this
									._saveStatus(this.process, false));
							FB.getLoginStatus(this._saveStatus(this.process,
									false));
						}
						return true;
					},
					getButtonMarkup : function() {
						var a = this.getOriginalHTML();
						if (a)
							return a;
						if (!this._attr.registration_url) {
							if (FB.getAccessToken()
									&& this._attr.autologoutlink) {
								return FB.Intl.tx._("Facebook Logout");
							} else if (FB.getAccessToken()) {
								return '';
							} else
								return this._getLoginText();
						} else
							switch (this._attr.status) {
								case 'unknown' :
									return this._getLoginText();
								case 'notConnected' :
								case 'not_authorized' :
									return FB.Intl.tx._("Register");
								case 'connected' :
									if (FB.getAccessToken()
											&& this._attr.autologoutlink)
										return FB.Intl.tx._("Facebook Logout");
									return '';
								default :
									FB.log('Unknown status: '
											+ this._attr.status);
									return FB.Intl.tx._("Log In");
							}
					},
					_getLoginText : function() {
						return this._attr.length == 'short' ? FB.Intl.tx
								._("Log In") : FB.Intl.tx
								._("Log In with Facebook");
					},
					onClick : function() {
						if (!this._attr.registration_url) {
							if (!FB.getAccessToken()
									|| !this._attr.autologoutlink) {
								FB.login(FB.bind(this._authCallback, this), {
									perms : this._attr.perms,
									scope : this._attr.scope
								});
							} else
								FB.logout(FB.bind(this._authCallback, this));
						} else
							switch (this._attr.status) {
								case 'unknown' :
									FB.ui({
										method : 'auth.logintoFacebook'
									}, FB.bind(function(a) {
										FB.bind(FB.getLoginStatus(this
												._saveStatus(
														this._authCallback,
														true), true), this);
									}, this));
									break;
								case 'notConnected' :
								case 'not_authorized' :
									window.top.location = this._attr.registration_url;
									break;
								case 'connected' :
									if (!FB.getAccessToken()
											|| !this._attr.autologoutlink) {
										this._authCallback();
									} else
										FB.logout(FB.bind(this._authCallback,
												this));
									break;
								default :
									FB.log('Unknown status: '
											+ this._attr.status);
							}
					},
					_authCallback : function(a) {
						FB.Helper.invokeHandler(this._attr.onlogin, this, [a]);
					},
					_saveStatus : function(a, b) {
						return FB
								.bind(
										function(c) {
											if (b
													&& this._attr.registration_url
													&& (this._attr.status == 'notConnected' || this._attr.status == 'not_authorized')
													&& (c.status == 'notConnected' || c.status == 'not_authorized'))
												window.top.location = this._attr.registration_url;
											this._attr.status = c.status;
											if (a) {
												a = this.bind(a, this);
												return a(c);
											}
										}, this);
					}
				});
FB.subclass('XFBML.Name', 'XFBML.Element', null, {
	process : function() {
		FB.copy(this, {
			_uid : this.getAttribute('uid'),
			_firstnameonly : this._getBoolAttribute('first-name-only'),
			_lastnameonly : this._getBoolAttribute('last-name-only'),
			_possessive : this._getBoolAttribute('possessive'),
			_reflexive : this._getBoolAttribute('reflexive'),
			_objective : this._getBoolAttribute('objective'),
			_linked : this._getBoolAttribute('linked', true),
			_subjectId : this.getAttribute('subject-id')
		});
		if (!this._uid) {
			FB.log('"uid" is a required attribute for <fb:name>');
			this.fire('render');
			return;
		}
		var a = [];
		if (this._firstnameonly) {
			a.push('first_name');
		} else if (this._lastnameonly) {
			a.push('last_name');
		} else
			a.push('name');
		if (this._subjectId) {
			a.push('sex');
			if (this._subjectId == FB.Helper.getLoggedInUser())
				this._reflexive = true;
		}
		var b;
		FB.Event.monitor('auth.statusChange', this.bind(function() {
			if (!this.isValid()) {
				this.fire('render');
				return true;
			}
			if (!this._uid || this._uid == 'loggedinuser')
				this._uid = FB.Helper.getLoggedInUser();
			if (!this._uid)
				return;
			if (FB.Helper.isUser(this._uid)) {
				b = FB.Data._selectByIndex(a, 'user', 'uid', this._uid);
			} else
				b = FB.Data._selectByIndex(['name', 'id'], 'profile', 'id',
						this._uid);
			b.wait(this.bind(function(c) {
				if (this._subjectId == this._uid) {
					this._renderPronoun(c[0]);
				} else
					this._renderOther(c[0]);
				this.fire('render');
			}));
		}));
	},
	_renderPronoun : function(a) {
		var b = '', c = this._objective;
		if (this._subjectId) {
			c = true;
			if (this._subjectId === this._uid)
				this._reflexive = true;
		}
		if (this._uid == FB.Connect.get_loggedInUser()
				&& this._getBoolAttribute('use-you', true)) {
			if (this._possessive) {
				if (this._reflexive) {
					b = 'your own';
				} else
					b = 'your';
			} else if (this._reflexive) {
				b = 'yourself';
			} else
				b = 'you';
		} else
			switch (a.sex) {
				case 'male' :
					if (this._possessive) {
						b = this._reflexive ? 'his own' : 'his';
					} else if (this._reflexive) {
						b = 'himself';
					} else if (c) {
						b = 'him';
					} else
						b = 'he';
					break;
				case 'female' :
					if (this._possessive) {
						b = this._reflexive ? 'her own' : 'her';
					} else if (this._reflexive) {
						b = 'herself';
					} else if (c) {
						b = 'her';
					} else
						b = 'she';
					break;
				default :
					if (this._getBoolAttribute('use-they', true)) {
						if (this._possessive) {
							if (this._reflexive) {
								b = 'their own';
							} else
								b = 'their';
						} else if (this._reflexive) {
							b = 'themselves';
						} else if (c) {
							b = 'them';
						} else
							b = 'they';
					} else if (this._possessive) {
						if (this._reflexive) {
							b = 'his/her own';
						} else
							b = 'his/her';
					} else if (this._reflexive) {
						b = 'himself/herself';
					} else if (c) {
						b = 'him/her';
					} else
						b = 'he/she';
					break;
			}
		if (this._getBoolAttribute('capitalize', false))
			b = FB.Helper.upperCaseFirstChar(b);
		this.dom.innerHTML = b;
	},
	_renderOther : function(a) {
		var b = '', c = '';
		if (this._uid == FB.Helper.getLoggedInUser()
				&& this._getBoolAttribute('use-you', true)) {
			if (this._reflexive) {
				if (this._possessive) {
					b = 'your own';
				} else
					b = 'yourself';
			} else if (this._possessive) {
				b = 'your';
			} else
				b = 'you';
		} else if (a) {
			if (null === a.first_name)
				a.first_name = '';
			if (null === a.last_name)
				a.last_name = '';
			if (this._firstnameonly && a.first_name !== undefined) {
				b = FB.String.escapeHTML(a.first_name);
			} else if (this._lastnameonly && a.last_name !== undefined)
				b = FB.String.escapeHTML(a.last_name);
			if (!b)
				b = FB.String.escapeHTML(a.name);
			if (b !== '' && this._possessive)
				b += '\'s';
		}
		if (!b)
			b = FB.String.escapeHTML(this.getAttribute('if-cant-see',
					'Facebook User'));
		if (b) {
			if (this._getBoolAttribute('capitalize', false))
				b = FB.Helper.upperCaseFirstChar(b);
			if (a && this._linked) {
				c = FB.Helper.getProfileLink(a, b, this.getAttribute('href',
						null));
			} else
				c = b;
		}
		this.dom.innerHTML = c;
	}
});
FB
		.subclass(
				'XFBML.ProfilePic',
				'XFBML.Element',
				null,
				{
					process : function() {
						var a = this.getAttribute('size', 'thumb'), b = FB.XFBML.ProfilePic._sizeToPicFieldMap[a], c = this
								._getPxAttribute('width'), d = this
								._getPxAttribute('height'), e = this.dom.style, f = this
								.getAttribute('uid');
						if (this._getBoolAttribute('facebook-logo'))
							b += '_with_logo';
						if (c) {
							c = c + 'px';
							e.width = c;
						}
						if (d) {
							d = d + 'px';
							e.height = d;
						}
						var g = this
								.bind(function(h) {
									var i = h ? h[0] : null, j = i
											? i[b]
											: null;
									if (!j)
										j = FB.getDomain('cdn')
												+ FB.XFBML.ProfilePic._defPicMap[b];
									var k = ((c ? 'width:' + c + ';' : '') + (d
											? 'height:' + c + ';'
											: '')), l = FB.String
											.format(
													'<img src="{0}" alt="{1}" title="{1}" style="{2}" class="{3}" />',
													j,
													i
															? FB.String
																	.escapeHTML(i.name)
															: '', k,
													this.dom.className);
									if (this._getBoolAttribute('linked', true))
										l = FB.Helper.getProfileLink(i, l, this
												.getAttribute('href', null));
									this.dom.innerHTML = l;
									FB.Dom.addCss(this.dom,
											'fb_profile_pic_rendered');
									this.fire('render');
								});
						FB.Event
								.monitor(
										'auth.statusChange',
										this
												.bind(function() {
													if (!this.isValid()) {
														this.fire('render');
														return true;
													}
													if (this.getAttribute(
															'uid', null) == 'loggedinuser')
														f = FB.Helper
																.getLoggedInUser();
													if (FB._userStatus && f) {
														FB.Data
																._selectByIndex(
																		[
																				'name',
																				b],
																		FB.Helper
																				.isUser(f)
																				? 'user'
																				: 'profile',
																		FB.Helper
																				.isUser(f)
																				? 'uid'
																				: 'id',
																		f)
																.wait(g);
													} else
														g();
												}));
					}
				});
FB.provide('XFBML.ProfilePic', {
	_defPicMap : {
		pic : 'pics/s_silhouette.jpg',
		pic_big : 'pics/d_silhouette.gif',
		pic_big_with_logo : 'pics/d_silhouette_logo.gif',
		pic_small : 'pics/t_silhouette.jpg',
		pic_small_with_logo : 'pics/t_silhouette_logo.gif',
		pic_square : 'pics/q_silhouette.gif',
		pic_square_with_logo : 'pics/q_silhouette_logo.gif',
		pic_with_logo : 'pics/s_silhouette_logo.gif'
	},
	_sizeToPicFieldMap : {
		n : 'pic_big',
		normal : 'pic_big',
		q : 'pic_square',
		s : 'pic',
		small : 'pic',
		square : 'pic_square',
		t : 'pic_small',
		thumb : 'pic_small'
	}
});
FB.subclass('XFBML.Question', 'XFBML.IframeWidget', null, {
	_visibleAfter : 'load',
	setupAndValidate : function() {
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			permalink : this.getAttribute('permalink'),
			id : this.getAttribute('id'),
			width : this._getPxAttribute('width', 400),
			height : 0,
			questiontext : this.getAttribute('questiontext'),
			options : this.getAttribute('options')
		};
		this.subscribe('xd.firstVote', FB.bind(this._onInitialVote, this));
		this.subscribe('xd.vote', FB.bind(this._onChangedVote, this));
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._attr.height
		};
	},
	getUrlBits : function() {
		return {
			name : 'question',
			params : this._attr
		};
	},
	_onInitialVote : function(a) {
		FB.Event.fire('question.firstVote', this._attr.permalink, a.vote);
	},
	_onChangedVote : function(a) {
		FB.Event.fire('question.vote', this._attr.permalink, a.vote);
	}
});
FB.subclass('XFBML.Recommendations', 'XFBML.IframeWidget', null, {
	_visibleAfter : 'load',
	_refreshOnAuthChange : true,
	setupAndValidate : function() {
		this._attr = {
			border_color : this.getAttribute('border-color'),
			colorscheme : this.getAttribute('color-scheme'),
			filter : this.getAttribute('filter'),
			font : this.getAttribute('font'),
			action : this.getAttribute('action'),
			linktarget : this.getAttribute('linktarget', '_blank'),
			max_age : this.getAttribute('max_age'),
			header : this._getBoolAttribute('header'),
			height : this._getPxAttribute('height', 300),
			site : this.getAttribute('site', location.hostname),
			width : this._getPxAttribute('width', 300)
		};
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._attr.height
		};
	},
	getUrlBits : function() {
		return {
			name : 'recommendations',
			params : this._attr
		};
	}
});
FB
		.subclass(
				'XFBML.RecommendationsBar',
				'XFBML.IframeWidget',
				null,
				{
					getUrlBits : function() {
						return {
							name : 'recommendations_bar',
							params : this._attr
						};
					},
					setupAndValidate : function() {
						function a(j, k) {
							var l = 0, m = null;
							function n() {
								k();
								m = null;
								l = (new Date()).getTime();
							}
							return function() {
								if (!m) {
									var o = (new Date()).getTime();
									if (o - l < j) {
										m = window.setTimeout(n, j - (o - l));
									} else
										n();
								}
								return true;
							};
						}
						function b(j) {
							if (j.match(/^\d+(?:\.\d+)?%$/)) {
								var k = Math.min(Math.max(parseInt(j, 10), 0),
										100);
								j = k / 100;
							} else if (j != 'manual' && j != 'onvisible')
								j = 'onvisible';
							return j;
						}
						function c(j) {
							return Math.max(parseInt(j, 10) || 30, 10);
						}
						function d(j) {
							if (j == 'left' || j == 'right')
								return j;
							return FB._localeIsRtl ? 'left' : 'right';
						}
						this._attr = {
							channel : this.getChannelUrl(),
							api_key : FB._apiKey,
							font : this.getAttribute('font'),
							colorscheme : this.getAttribute('colorscheme'),
							href : FB.URI.resolve(this.getAttribute('href')),
							side : d(this.getAttribute('side')),
							site : this.getAttribute('site'),
							action : this.getAttribute('action'),
							ref : this.getAttribute('ref'),
							max_age : this.getAttribute('max_age'),
							trigger : b(this.getAttribute('trigger', '')),
							read_time : c(this.getAttribute('read_time')),
							num_recommendations : parseInt(this
									.getAttribute('num_recommendations'), 10) || 2
						};
						FB._inPlugin = true;
						this._showLoader = false;
						this.subscribe('iframe.onload', FB.bind(function() {
							var j = this.dom.children[0];
							j.className = 'fbpluginrecommendationsbar'
									+ this._attr.side;
						}, this));
						var e = FB
								.bind(
										function() {
											FB.Event.unlisten(window, 'scroll',
													e);
											FB.Event.unlisten(
													document.documentElement,
													'click', e);
											FB.Event.unlisten(
													document.documentElement,
													'mousemove', e);
											window
													.setTimeout(
															FB
																	.bind(
																			this.arbiterInform,
																			this,
																			'platform/plugins/recommendations_bar/action',
																			null,
																			FB.Arbiter.BEHAVIOR_STATE),
															this._attr.read_time * 1000);
											return true;
										}, this);
						FB.Event.listen(window, 'scroll', e);
						FB.Event.listen(document.documentElement, 'click', e);
						FB.Event.listen(document.documentElement, 'mousemove',
								e);
						if (this._attr.trigger == "manual") {
							var f = FB
									.bind(
											function(j) {
												if (j == this._attr.href) {
													FB.Event
															.unsubscribe(
																	'xfbml.recommendationsbar.read',
																	f);
													this
															.arbiterInform(
																	'platform/plugins/recommendations_bar/trigger',
																	null,
																	FB.Arbiter.BEHAVIOR_STATE);
												}
												return true;
											}, this);
							FB.Event.subscribe('xfbml.recommendationsbar.read',
									f);
						} else {
							var g = a(
									500,
									FB
											.bind(
													function() {
														if (this
																.calculateVisibility()) {
															FB.Event
																	.unlisten(
																			window,
																			'scroll',
																			g);
															FB.Event
																	.unlisten(
																			window,
																			'resize',
																			g);
															this
																	.arbiterInform(
																			'platform/plugins/recommendations_bar/trigger',
																			null,
																			FB.Arbiter.BEHAVIOR_STATE);
														}
														return true;
													}, this));
							FB.Event.listen(window, 'scroll', g);
							FB.Event.listen(window, 'resize', g);
							g();
						}
						this.visible = false;
						var h = a(
								500,
								FB
										.bind(
												function() {
													if (!this.visible
															&& this
																	.calculateVisibility()) {
														this.visible = true;
														this
																.arbiterInform('platform/plugins/recommendations_bar/visible');
													} else if (this.visible
															&& !this
																	.calculateVisibility()) {
														this.visible = false;
														this
																.arbiterInform('platform/plugins/recommendations_bar/invisible');
													}
													return true;
												}, this));
						FB.Event.listen(window, 'scroll', h);
						FB.Event.listen(window, 'resize', h);
						h();
						this.focused = true;
						var i = FB.bind(function() {
							this.focused = !this.focused;
							return true;
						}, this);
						FB.Event.listen(window, 'blur', i);
						FB.Event.listen(window, 'focus', i);
						this.resize_running = false;
						this.animate = false;
						this.subscribe('xd.signal_animation', FB.bind(
								function() {
									this.animate = true;
								}, this));
						return true;
					},
					getSize : function() {
						return {
							height : 25,
							width : (this._attr.action == 'recommend'
									? 140
									: 96)
						};
					},
					calculateVisibility : function() {
						var a = document.documentElement.clientHeight;
						if (!this.focused && window.console
								&& window.console.firebug)
							return this.visible;
						switch (this._attr.trigger) {
							case "manual" :
								return false;
							case "onvisible" :
								var b = this.dom.getBoundingClientRect().top;
								return b <= a;
							default :
								var c = window.pageYOffset
										|| document.body.scrollTop, d = document.documentElement.scrollHeight;
								return (c + a) / d >= this._attr.trigger;
						}
					},
					_handleResizeMsg : function(a) {
						if (!this.isValid())
							return;
						if (a.width)
							this.getIframeNode().style.width = a.width + 'px';
						if (a.height) {
							this._setNextResize(a.height);
							this._checkNextResize();
						}
						this._makeVisible();
					},
					_setNextResize : function(a) {
						this.next_resize = a;
					},
					_checkNextResize : function() {
						if (!this.next_resize || this.resize_running)
							return;
						var a = this.getIframeNode(), b = this.next_resize;
						this.next_resize = null;
						if (this.animate) {
							this.animate = false;
							this.resize_running = true;
							FB.Anim.ate(a, {
								height : b + 'px'
							}, 330, FB.bind(function() {
								this.resize_running = false;
								this._checkNextResize();
							}, this));
						} else
							a.style.height = b + 'px';
					}
				});
FB.XFBML.RecommendationsBar.markRead = function(a) {
	FB.Event.fire('xfbml.recommendationsbar.read', a || window.location.href);
};
FB.subclass('XFBML.Registration', 'XFBML.IframeWidget', null, {
	_visibleAfter : 'immediate',
	_baseHeight : 167,
	_fieldHeight : 28,
	_skinnyWidth : 520,
	_skinnyBaseHeight : 173,
	_skinnyFieldHeight : 52,
	setupAndValidate : function() {
		this._attr = {
			action : this.getAttribute('action'),
			border_color : this.getAttribute('border-color'),
			channel_url : this.getChannelUrl(),
			client_id : FB._apiKey,
			fb_only : this._getBoolAttribute('fb-only', false),
			fb_register : this._getBoolAttribute('fb-register', false),
			fields : this.getAttribute('fields'),
			height : this._getPxAttribute('height'),
			redirect_uri : this.getAttribute('redirect-uri',
					window.location.href),
			no_footer : this._getBoolAttribute('no-footer'),
			no_header : this._getBoolAttribute('no-header'),
			onvalidate : this.getAttribute('onvalidate'),
			width : this._getPxAttribute('width', 600),
			target : this.getAttribute('target')
		};
		if (this._attr.onvalidate)
			this.subscribe('xd.validate', this.bind(function(a) {
				var b = FB.JSON.parse(a.value), c = this.bind(function(e) {
					FB.Arbiter.inform('Registration.Validation', {
						errors : e,
						id : a.id
					}, 'parent.frames["' + this.getIframeNode().name + '"]',
							this._attr.channel_url.substring(0, 5) == "https");
				}), d = FB.Helper.executeFunctionByName(this._attr.onvalidate,
						b, c);
				if (d)
					c(d);
			}));
		this.subscribe('xd.authLogin', FB.bind(this._onAuthLogin, this));
		this.subscribe('xd.authLogout', FB.bind(this._onAuthLogout, this));
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._getHeight()
		};
	},
	_getHeight : function() {
		if (this._attr.height)
			return this._attr.height;
		var a;
		if (!this._attr.fields) {
			a = ['name'];
		} else
			try {
				a = FB.JSON.parse(this._attr.fields);
			} catch (b) {
				a = this._attr.fields.split(/,/);
			}
		if (this._attr.width < this._skinnyWidth) {
			return this._skinnyBaseHeight + a.length * this._skinnyFieldHeight;
		} else
			return this._baseHeight + a.length * this._fieldHeight;
	},
	getUrlBits : function() {
		return {
			name : 'registration',
			params : this._attr
		};
	},
	getDefaultWebDomain : function() {
		return 'https_www';
	},
	_onAuthLogin : function() {
		if (!FB.getAuthResponse())
			FB.getLoginStatus();
		FB.Helper.fireEvent('auth.login', this);
	},
	_onAuthLogout : function() {
		if (!FB.getAuthResponse())
			FB.getLoginStatus();
		FB.Helper.fireEvent('auth.logout', this);
	}
});
FB.subclass('XFBML.ServerFbml', 'XFBML.IframeWidget', null, {
	_visibleAfter : 'resize',
	setupAndValidate : function() {
		this._attr = {
			channel_url : this.getChannelUrl(),
			fbml : this.getAttribute('fbml'),
			width : this._getPxAttribute('width')
		};
		if (!this._attr.fbml) {
			var a = this.dom.getElementsByTagName('script')[0];
			if (a && a.type === 'text/fbml')
				this._attr.fbml = a.innerHTML;
		}
		if (!this._attr.fbml) {
			FB.log('<fb:serverfbml> requires the "fbml" attribute.');
			return false;
		}
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._attr.height
		};
	},
	getUrlBits : function() {
		return {
			name : 'serverfbml',
			params : this._attr
		};
	}
});
FB
		.subclass(
				'XFBML.ShareButton',
				'XFBML.Element',
				null,
				{
					process : function() {
						this._href = this.getAttribute('href',
								window.location.href);
						this._type = this.getAttribute('type', 'icon_link');
						FB.Dom.addCss(this.dom, 'fb_share_count_hidden');
						this._renderButton(true);
					},
					_renderButton : function(a) {
						if (!this.isValid()) {
							this.fire('render');
							return;
						}
						var b = '', c = '', d = '', e = '', f = FB.Intl.tx
								._("Share"), g = '';
						switch (this._type) {
							case 'icon' :
							case 'icon_link' :
								e = 'fb_button_simple';
								b = ('<span class="fb_button_text">'
										+ (this._type == 'icon_link'
												? f
												: '&nbsp;') + '</span>');
								a = false;
								break;
							case 'link' :
								b = FB.Intl.tx._("Share on Facebook");
								a = false;
								break;
							case 'button' :
								b = '<span class="fb_button_text">' + f
										+ '</span>';
								e = 'fb_button fb_button_small';
								a = false;
								break;
							case 'button_count' :
								b = '<span class="fb_button_text">' + f
										+ '</span>';
								c = ('<span class="fb_share_count_nub_right">&nbsp;</span>'
										+ '<span class="fb_share_count fb_share_count_right">'
										+ this._getCounterMarkup() + '</span>');
								e = 'fb_button fb_button_small';
								break;
							default :
								b = '<span class="fb_button_text">' + f
										+ '</span>';
								d = ('<span class="fb_share_count_nub_top">&nbsp;</span>'
										+ '<span class="fb_share_count fb_share_count_top">'
										+ this._getCounterMarkup() + '</span>');
								e = 'fb_button fb_button_small';
								g = 'fb_share_count_wrapper';
						}
						var h = FB.guid();
						this.dom.innerHTML = FB.String.format(
								'<span class="{0}">{4}<a id="{1}" class="{2}" '
										+ 'target="_blank">{3}</a>{5}</span>',
								g, h, e, b, d, c);
						var i = document.getElementById(h);
						i.href = this._href;
						i.onclick = function() {
							FB.ui({
								method : 'stream.share',
								u : this.href
							});
							return false;
						};
						if (!a)
							this.fire('render');
					},
					_getCounterMarkup : function() {
						if (!this._count)
							this._count = FB.Data._selectByIndex(
									['total_count'], 'link_stat', 'url',
									this._href);
						var a = '0';
						if (this._count.value !== undefined) {
							if (this._count.value.length > 0) {
								var b = this._count.value[0].total_count;
								if (b > 3) {
									FB.Dom.removeCss(this.dom,
											'fb_share_count_hidden');
									a = b >= 1e+07 ? Math.round(b / 1e+06)
											+ 'M' : (b >= 10000 ? Math
											.round(b / 1000)
											+ 'K' : b);
								}
							}
						} else
							this._count.wait(FB.bind(this._renderButton, this,
									false));
						return '<span class="fb_share_count_inner">' + a
								+ '</span>';
					}
				});
FB.subclass('XFBML.SocialContext', 'XFBML.IframeWidget', null, {
	setupAndValidate : function() {
		var a = this.getAttribute('size', 'small');
		this._attr = {
			channel : this.getChannelUrl(),
			width : this._getPxAttribute('width', 400),
			height : this._getPxAttribute('height', 100),
			ref : this.getAttribute('ref'),
			size : this.getAttribute('size'),
			keywords : this.getAttribute('keywords'),
			urls : this.getAttribute('urls')
		};
		return true;
	},
	getSize : function() {
		return {
			width : this._attr.width,
			height : this._attr.height
		};
	},
	getUrlBits : function() {
		return {
			name : 'social_context',
			params : this._attr
		};
	}
});
FB.subclass('XFBML.Subscribe', 'XFBML.EdgeWidget', null, {
	setupAndValidate : function() {
		this._attr = {
			channel : this.getChannelUrl(),
			api_key : FB._apiKey,
			font : this.getAttribute('font'),
			colorscheme : this.getAttribute('colorscheme', 'light'),
			href : this.getAttribute('href'),
			ref : this.getAttribute('ref'),
			layout : this._getLayout(),
			show_faces : this._shouldShowFaces(),
			width : this._getWidgetWidth()
		};
		return true;
	},
	getUrlBits : function() {
		return {
			name : 'subscribe',
			params : this._attr
		};
	},
	_getWidgetWidth : function() {
		var a = this._getLayout(), b = {
			standard : 450,
			box_count : 83,
			button_count : 115
		}, c = b[a], d = this._getPxAttribute('width', c), e = {
			standard : {
				min : 225,
				max : 900
			},
			box_count : {
				min : 43,
				max : 900
			},
			button_count : {
				min : 63,
				max : 900
			}
		};
		if (d < e[a].min) {
			d = e[a].min;
		} else if (d > e[a].max)
			d = e[a].max;
		return d;
	}
});
void (0);
FB.provide("", {
	"_domain" : {
		"api" : "https:\/\/api.facebook.com\/",
		"api_read" : "https:\/\/api-read.facebook.com\/",
		"cdn" : "http:\/\/static.ak.fbcdn.net\/",
		"cdn_foreign" : "http:\/\/connect.facebook.net\/",
		"graph" : "https:\/\/graph.facebook.com\/",
		"https_cdn" : "https:\/\/s-static.ak.fbcdn.net\/",
		"https_staticfb" : "https:\/\/s-static.ak.facebook.com\/",
		"https_www" : "https:\/\/www.facebook.com\/",
		"staticfb" : "http:\/\/static.ak.facebook.com\/",
		"www" : "http:\/\/www.facebook.com\/",
		"m" : "http:\/\/m.facebook.com\/",
		"https_m" : "https:\/\/m.facebook.com\/"
	},
	"_locale" : "en_US",
	"_localeIsRtl" : false
}, true);
FB.provide("Flash", {
	"_minVersions" : [[10, 3, 181, 34], [11, 0, 0]],
	"_swfPath" : "rsrc.php\/v1\/yQ\/r\/f3KaqM7xIBg.swf"
}, true);
FB.provide("XD", {
	"_xdProxyUrl" : "connect\/xd_proxy.php?version=3"
}, true);
FB.provide("Arbiter", {
	"_canvasProxyUrl" : "connect\/canvas_proxy.php?version=3"
}, true);
FB.provide('Auth', {
	"_xdStorePath" : "xd_localstorage\/v2"
}, true);
FB.provide("Canvas.Prefetcher", {
	"_appIdsBlacklist" : [144959615576466],
	"_sampleRate" : 500
}, true);
FB.initSitevars = {
	"parseXFBMLBeforeDomReady" : false,
	"computeContentSizeVersion" : 0,
	"enableMobile" : 1,
	"enableMobileComments" : 1,
	"forceSecureXdProxy" : 1,
	"iframePermissions" : {
		"read_stream" : false,
		"manage_mailbox" : false,
		"manage_friendlists" : false,
		"read_mailbox" : false,
		"publish_checkins" : true,
		"status_update" : true,
		"photo_upload" : true,
		"video_upload" : true,
		"sms" : false,
		"create_event" : true,
		"rsvp_event" : true,
		"offline_access" : true,
		"email" : true,
		"xmpp_login" : false,
		"create_note" : true,
		"share_item" : true,
		"export_stream" : false,
		"publish_stream" : true,
		"publish_likes" : true,
		"ads_management" : false,
		"contact_email" : true,
		"access_private_data" : false,
		"read_insights" : false,
		"read_requests" : false,
		"read_friendlists" : true,
		"manage_pages" : false,
		"physical_login" : false,
		"manage_groups" : false,
		"read_deals" : false
	}
};
FB.forceOAuth = true;
FB.widgetPipeEnabledApps = {
	"111476658864976" : 1,
	"cca6477272fc5cb805f85a84f20fca1d" : 1,
	"179150165472010" : 1
};
FB.widgetPipeTagCountThreshold = 4;
FB.provide("TemplateData", {
	"_enabled" : true
}, true);
FB.provide("TemplateUI", {
	"_version" : 19
}, true);
FB.provide("XFBML.ConnectBar", {
	"imgs" : {
		"buttonUrl" : "rsrc.php\/v1\/yY\/r\/h_Y6u1wrZPW.png",
		"missingProfileUrl" : "rsrc.php\/v1\/yo\/r\/UlIqmHJn-SK.gif"
	}
}, true);
FB.provide("XFBML.ProfilePic", {
	"_defPicMap" : {
		"pic" : "rsrc.php\/v1\/yh\/r\/C5yt7Cqf3zU.jpg",
		"pic_big" : "rsrc.php\/v1\/yL\/r\/HsTZSDw4avx.gif",
		"pic_big_with_logo" : "rsrc.php\/v1\/y5\/r\/SRDCaeCL7hM.gif",
		"pic_small" : "rsrc.php\/v1\/yi\/r\/odA9sNLrE86.jpg",
		"pic_small_with_logo" : "rsrc.php\/v1\/yD\/r\/k1xiRXKnlGd.gif",
		"pic_square" : "rsrc.php\/v1\/yo\/r\/UlIqmHJn-SK.gif",
		"pic_square_with_logo" : "rsrc.php\/v1\/yX\/r\/9dYJBPDHXwZ.gif",
		"pic_with_logo" : "rsrc.php\/v1\/yu\/r\/fPPR9f2FJ3t.gif"
	}
}, true);
if (FB.Dom && FB.Dom.addCssRules) {
	FB.Dom
			.addCssRules(
					".fb_hidden{position:absolute;top:-10000px;z-index:10001}\n.fb_invisible{display:none}\n.fb_reset{background:none;border-spacing:0;border:0;color:#000;cursor:auto;direction:ltr;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif;font-size: 11px;font-style:normal;font-variant:normal;font-weight:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal}\n.fb_link img{border:none}\n.fb_dialog{background:rgba(82, 82, 82, .7);position:absolute;top:-10000px;z-index:10001}\n.fb_dialog_advanced{padding:10px;-moz-border-radius:8px;-webkit-border-radius:8px}\n.fb_dialog_content{background:#fff;color:#333}\n.fb_dialog_close_icon{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yq\/r\/IE9JII6Z1Ys.png) no-repeat scroll 0 0 transparent;_background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yL\/r\/s816eWC-2sl.gif);cursor:pointer;display:block;height:15px;position:absolute;right:18px;top:17px;width:15px;top:8px\\9;right:7px\\9}\n.fb_dialog_mobile .fb_dialog_close_icon{top:5px;left:5px;right:auto}\n.fb_dialog_padding{background-color:transparent;position:absolute;width:1px;z-index:-1}\n.fb_dialog_close_icon:hover{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yq\/r\/IE9JII6Z1Ys.png) no-repeat scroll 0 -15px transparent;_background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yL\/r\/s816eWC-2sl.gif)}\n.fb_dialog_close_icon:active{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yq\/r\/IE9JII6Z1Ys.png) no-repeat scroll 0 -30px transparent;_background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yL\/r\/s816eWC-2sl.gif)}\n.fb_dialog_loader{background-color:#f2f2f2;border:1px solid #606060;font-size: 24px;padding:20px}\n.fb_dialog_top_left,\n.fb_dialog_top_right,\n.fb_dialog_bottom_left,\n.fb_dialog_bottom_right{height:10px;width:10px;overflow:hidden;position:absolute}\n.fb_dialog_top_left{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 0;left:-10px;top:-10px}\n.fb_dialog_top_right{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 -10px;right:-10px;top:-10px}\n.fb_dialog_bottom_left{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 -20px;bottom:-10px;left:-10px}\n.fb_dialog_bottom_right{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 -30px;right:-10px;bottom:-10px}\n.fb_dialog_vert_left,\n.fb_dialog_vert_right,\n.fb_dialog_horiz_top,\n.fb_dialog_horiz_bottom{position:absolute;background:#525252;filter:alpha(opacity=70);opacity:.7}\n.fb_dialog_vert_left,\n.fb_dialog_vert_right{width:10px;height:100\u0025}\n.fb_dialog_vert_left{margin-left:-10px}\n.fb_dialog_vert_right{right:0;margin-right:-10px}\n.fb_dialog_horiz_top,\n.fb_dialog_horiz_bottom{width:100\u0025;height:10px}\n.fb_dialog_horiz_top{margin-top:-10px}\n.fb_dialog_horiz_bottom{bottom:0;margin-bottom:-10px}\n.fb_dialog_iframe{line-height:0}\n.fb_dialog_content .dialog_title{background:#6d84b4;border:1px solid #3b5998;color:#fff;font-size: 14px;font-weight:bold;margin:0}\n.fb_dialog_content .dialog_title > span{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yd\/r\/Cou7n-nqK52.gif)\nno-repeat 5px 50\u0025;float:left;padding:5px 0 7px 26px}\nbody.fb_hidden{-webkit-transform:none;height:100\u0025;margin:0;left:-10000px;overflow:visible;position:absolute;top:-10000px;width:100\u0025\n}\n.fb_dialog.fb_dialog_mobile.loading{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yO\/r\/_j03izEX40U.gif)\nwhite no-repeat 50\u0025 50\u0025;min-height:100\u0025;min-width:100\u0025;overflow:hidden;position:absolute;top:0;z-index:10001}\n.fb_dialog.fb_dialog_mobile.loading.centered{max-height:590px;min-height:590px;max-width:500px;min-width:500px}\n#fb-root #fb_dialog_ipad_overlay{background:rgba(0, 0, 0, .45);position:absolute;left:0;top:0;width:100\u0025;min-height:100\u0025;z-index:10000}\n#fb-root #fb_dialog_ipad_overlay.hidden{display:none}\n.fb_dialog.fb_dialog_mobile.loading iframe{visibility:hidden}\n.fb_dialog_content .dialog_header{-webkit-box-shadow:white 0 1px 1px -1px inset;background:-webkit-gradient(linear, 0 0, 0 100\u0025, from(#738ABA), to(#2C4987));border-bottom:1px solid;border-color:#1d4088;color:#fff;font:14px Helvetica, sans-serif;font-weight:bold;text-overflow:ellipsis;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0;vertical-align:middle;white-space:nowrap}\n.fb_dialog_content .dialog_header table{-webkit-font-smoothing:subpixel-antialiased;height:43px;width:100\u0025\n}\n.fb_dialog_content .dialog_header td.header_left{font-size: 12px;padding-left:5px;vertical-align:middle;width:60px\n}\n.fb_dialog_content .dialog_header td.header_right{font-size: 12px;padding-right:5px;vert...fb_button_text{padding:2px 6px;margin-right:18px}\na.fb_button_small_rtl:active{background-position:right -458px}\n.fb_share_count_wrapper{position:relative;float:left}\n.fb_share_count{background:#b0b9ec none repeat scroll 0 0;color:#333;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif;text-align:center}\n.fb_share_count_inner{background:#e8ebf2;display:block}\n.fb_share_count_right{margin-left:-1px;display:inline-block}\n.fb_share_count_right .fb_share_count_inner{border-top:solid 1px #e8ebf2;border-bottom:solid 1px #b0b9ec;margin:1px 1px 0 1px;font-size: 10px;line-height:10px;padding:2px 6px 3px;font-weight:bold}\n.fb_share_count_top{display:block;letter-spacing:-1px;line-height:34px;margin-bottom:7px;font-size: 22px;border:solid 1px #b0b9ec}\n.fb_share_count_nub_top{border:none;display:block;position:absolute;left:7px;top:35px;margin:0;padding:0;width:6px;height:7px;background-repeat:no-repeat;background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yU\/r\/bSOHtKbCGYI.png)}\n.fb_share_count_nub_right{border:none;display:inline-block;padding:0;width:5px;height:10px;background-repeat:no-repeat;background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v1\/yX\/r\/i_oIVTKMYsL.png);vertical-align:top;background-position:right 5px;z-index:10;left:2px;margin:0 2px 0 0;position:relative}\n.fb_share_no_count{display:none}\n.fb_share_size_Small .fb_share_count_right .fb_share_count_inner{font-size: 10px}\n.fb_share_size_Medium .fb_share_count_right .fb_share_count_inner{font-size: 11px;padding:2px 6px 3px;letter-spacing:-1px;line-height:14px}\n.fb_share_size_Large .fb_share_count_right .fb_share_count_inner{font-size: 13px;line-height:16px;padding:2px 6px 4px;font-weight:normal;letter-spacing:-1px}\n.fb_share_count_hidden .fb_share_count_nub_top,\n.fb_share_count_hidden .fb_share_count_top,\n.fb_share_count_hidden .fb_share_count_nub_right,\n.fb_share_count_hidden .fb_share_count_right{visibility:hidden}\n.fb_connect_bar_container div,\n.fb_connect_bar_container span,\n.fb_connect_bar_container a,\n.fb_connect_bar_container img,\n.fb_connect_bar_container strong{background:none;border-spacing:0;border:0;direction:ltr;font-style:normal;font-variant:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal;vertical-align:baseline}\n.fb_connect_bar_container{position:fixed;left:0 !important;right:0 !important;height:42px !important;padding:0 25px !important;margin:0 !important;vertical-align:middle !important;border-bottom:1px solid #333 !important;background:#3b5998 !important;z-index:99999999 !important;overflow:hidden !important}\n.fb_connect_bar_container_ie6{position:absolute;top:expression(document.compatMode==\"CSS1Compat\"? document.documentElement.scrollTop+\"px\":body.scrollTop+\"px\")}\n.fb_connect_bar{position:relative;margin:auto;height:100\u0025;width:100\u0025;padding:6px 0 0 0 !important;background:none;color:#fff !important;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif !important;font-size: 13px !important;font-style:normal !important;font-variant:normal !important;font-weight:normal !important;letter-spacing:normal !important;line-height:1 !important;text-decoration:none !important;text-indent:0 !important;text-shadow:none !important;text-transform:none !important;white-space:normal !important;word-spacing:normal !important}\n.fb_connect_bar a:hover{color:#fff}\n.fb_connect_bar .fb_profile img{height:30px;width:30px;vertical-align:middle;margin:0 6px 5px 0}\n.fb_connect_bar div a,\n.fb_connect_bar span,\n.fb_connect_bar span a{color:#bac6da;font-size: 11px;text-decoration:none}\n.fb_connect_bar .fb_buttons{float:right;margin-top:7px}\n.fb_edge_widget_with_comment{position:relative;*z-index:1000}\n.fb_edge_widget_with_comment span.fb_edge_comment_widget{position:absolute}\n.fb_edge_widget_with_comment span.fb_send_button_form_widget{z-index:1}\n.fb_edge_widget_with_comment span.fb_send_button_form_widget .FB_Loader{left:0;top:1px;margin-top:6px;margin-left:0;background-position:50\u0025 50\u0025;background-color:#fff;height:150px;width:394px;border:1px #666 solid;border-bottom:2px solid #283e6c;z-index:1}\n.fb_edge_widget_with_comment span.fb_send_button_form_widget.dark .FB_Loader{background-color:#000;border-bottom:2px solid #ccc}\n.fb_edge_widget_with_comment span.fb_send_button_form_widget.siderender\n.FB_Loader{margin-top:0}\n.fbpluginrecommendationsbarleft,\n.fbpluginrecommendationsbarright{position:fixed !important;bottom:0;z-index:999}\n\/* \u0040noflip *\/\n.fbpluginrecommendationsbarleft{left:10px}\n\/* \u0040noflip *\/\n.fbpluginrecommendationsbarright{right:10px}\n",
					["fb.css.base", "fb.css.dialog", "fb.css.iframewidget",
							"fb.css.button", "fb.css.sharebutton",
							"fb.css.connectbarwidget",
							"fb.css.edgecommentwidget",
							"fb.css.sendbuttonformwidget",
							"fb.css.plugin.recommendationsbar"]);
}
