/**
 *
 */
Ext.onReady(function(){


    var store = Ext.create('CGP.configuration.store.ConfigStore');

    var tbar = Ext.create('Ext.toolbar.Toolbar',{
		items: [
			{
				itemId: 'btnSave', text: i18n.getKey('Save'),
				iconCls: 'icon_save',  handler: modify,
				style: {
            		marginLeft: '15px'
        		}
			},
			'-',
			{itemId: 'btnReset', text: i18n.getKey('reset'), iconCls: 'icon_reset', handler: reset}
		]	
	});
	var  mask;
    var pageform = Ext.create("Ext.form.Panel",{
    	title : i18n.getKey('productmedia') + i18n.getKey('paramconfig'),
    	height: 400,
		width: 500,
		//renderTo: Ext.getBody(),
		region: 'center',
		frame: false,
		tbar: tbar,
		defaults:{
			allowBlank : false,
			blankText : 'this value is required',
			style: {
           	 marginLeft: '20px',
           	 marginTop : '5px'
       		},
			msgTarget : 'side'
		},
	//	title: '<div style="background-color:red;">Product media config</div>',
		//bodyStyle: 'background:#ffc;',
		layout:{
			type: 'table',
			columns: 2
		},
		items : [
//			{
//			colspan : 2,
//			xtype : 'label',
//			html : '<div style="height:50px;line-height:50px;margin-left:20px;' +
//					'font-size:18px;">'+ getQueryString("website") +': Product media config</div>'
//		}
		],
		listeners: {
			render : function(component){
				mask = component.setLoading(true);
			}
		}
    });

    function modify(){

		var values = Ext.Object.getValues(pageform.getValues());
		var fields = pageform.getForm().getFields().items;
		for(var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var record = store.getById(field.itemId);
            record.set('value',field.getValue());
            record.save();
            record.commit();
		}
		store.sync();
		Ext.MessageBox.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess') +'!');
	}
	function reset(){
		var values = [];
		for(var i = 0;i<(store.getCount()); i++ ) {
			var conf = store.getAt(i);
			id = conf.get('id');
			value = conf.get('value');
			values.push({
				id: id,
				value: value
			});
		}
		pageform.getForm().setValues(values);
	}
	var imageMaxSize = new Ext.form.field.Text({
		fieldLabel : i18n.getKey('imageMaxSize + "(kb)"'),
		labelWidth : 140,
		colspan: 2
	});
	
//	var thumbnailResolution = new Ext.form.field.Text({
//		fieldLabel : i18n.getKey('thumbnail + resource.resolution'),
//		allowBlank : false,
//		blankText : 'this value is required',
//		msgTarget : 'side',
//		hidden: true
//	});
	
	var thumbnailX = new Ext.form.field.Number({
		msgTarget : 'side',
		width : 209,
		labelWidth : 140,
		hideTrigger : true,
		allowDecimals : false,
		fieldLabel : i18n.getKey('productmedia') + i18n.getKey('thumbnail') + "(px)"
	});
	
	var thumbnailY = new Ext.form.field.Number({
		fieldLabel : 'X',
		labelSeparator : '',
		labelWidth : 10,
		width : 79,
		style  : {
            marginLeft: '5px',
            marginTop : '5px'
        },
		allowBlank : false,
		blankText : 'this value is required',
		msgTarget : 'side',
		hideTrigger : true,
		allowDecimals : false
	});
    var mapX = new Ext.form.field.Number({
        msgTarget : 'side',
        width : 209,
        labelWidth : 140,
        hideTrigger : true,
        allowDecimals : false,
        fieldLabel : i18n.getKey('productmedia') + i18n.getKey('map') + "(px)"
    });
    var mapY = new Ext.form.field.Number({
        fieldLabel : 'X',
        labelSeparator : '',
        labelWidth : 10,
        width : 79,
        style  : {
            marginLeft: '5px',
            marginTop : '5px'
        },
        allowBlank : false,
        blankText : 'this value is required',
        msgTarget : 'side',
        hideTrigger : true,
        allowDecimals : false
    });
    var bigMapX = new Ext.form.field.Number({
        msgTarget : 'side',
        width : 209,
        labelWidth : 140,
        hideTrigger : true,
        allowDecimals : false,
        fieldLabel : i18n.getKey('productmedia') + i18n.getKey('bigMap') + "(px)"
    });
    var bigMapY = new Ext.form.field.Number({
        fieldLabel : 'X',
        labelSeparator : '',
        labelWidth : 10,
        width : 79,
        style  : {
            marginLeft: '5px',
            marginTop : '5px'
        },
        allowBlank : false,
        blankText : 'this value is required',
        msgTarget : 'side',
        hideTrigger : true,
        allowDecimals : false
    });

	function fillField(field, config, index) {
		field.name = config.get('key');
		field.setValue(config.get('value'));
		field.id = config.get('id');
		field.itemId = index;
		if (i18n.getKey(field.fieldLabel) != null
				&& i18n.getKey(field.fieldLabel) != '')
			field.fieldLabel = i18n.getKey(field.fieldLabel);
		//pageform.add(field);
	}
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	} 
	
	store.load({
		params: {groupId: 1,website: ''+getQueryString("website")+''},
		callback : function(records, options, success) {
			for ( var i = 0; i < records.length; i++) {
				var record = records[i];
				if(record.get("title") == "image max size"){
					fillField(imageMaxSize,record,record.get("id"))
				}
				else if(record.get("key") == "CONFIG_KEY_PRODUCT_IMAGE_THUMBNAIL_RESOLUTION_WIDTH"){
					thumbnailX.setValue(record.get("value"));
					fillField(thumbnailX,record,record.get('id'));
				}
				else if(record.get("key") == "CONFIG_KEY_PRODUCT_IMAGE_THUMBNAIL_RESOLUTION_HEIGHT"){
					thumbnailY.setValue(record.get("value"));
					fillField(thumbnailY,record,record.get('id'));
				}else if(record.get("key") == "CONFIG_KEY_PRODUCT_IMAGE_RESOLUTION_WIDTH"){
                    mapX.setValue(record.get("value"));
                    fillField(mapX,record,record.get('id'));
                }else if(record.get("key") == "CONFIG_KEY_PRODUCT_IMAGE_RESOLUTION_HEIGHT"){
                    mapY.setValue(record.get("value"));
                    fillField(mapY,record,record.get('id'));
                }else if(record.get("key") == "CONFIG_KEY_PRODUCT_IMAGE_BIG_RESOLUTION_WIDTH"){
                    bigMapX.setValue(record.get("value"));
                    fillField(bigMapX,record,record.get('id'));
                }else if(record.get("key") == "CONFIG_KEY_PRODUCT_IMAGE_BIG_RESOLUTION_HEIGHT"){
                    bigMapY.setValue(record.get("value"));
                    fillField(bigMapY,record,record.get('id'));
                }
			}
			pageform.add(thumbnailX);
			pageform.add(thumbnailY);
            pageform.add(mapX);
            pageform.add(mapY);
            pageform.add(bigMapX);
            pageform.add(bigMapY);
			pageform.add(imageMaxSize);
			mask.hide();
		}
	});


	new Ext.container.Viewport({
		layout : 'border',
		renderTo: 'jie',
		items : [ pageform ]
	});
});




























