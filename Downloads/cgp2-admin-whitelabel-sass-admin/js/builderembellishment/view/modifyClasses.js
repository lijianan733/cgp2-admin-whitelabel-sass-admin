



var id = null;
function onModify(record) {

	var model = record;
	id = model.get('id'); // 保存要修改类别的图片id
	var array = [];
	var listClass = model.get('bbgClasses'); // array 用来存放被选中的model的id
	for (var i = 0; i < listClass.length; i++) {
		array[i] = listClass[i];
	}

	var store = Ext.create("CGP.builderembellishment.store.BuilderEmbellishmentClass");
	store.loadPage(1);

	var win = new Ext.window.Window({
				layout : 'fit', // fit
				width : 400,
				closeAction : 'destroy',
				title : i18n.getKey('ModifyCategory'),
//				resizable : false,
				modal : true,
				closable : true,
				items: {
					id : 'modifyFormPanel',
					xtype : 'form',
					fieldDefaults : {
						labelSeparator : ':',
						labelWidth : 80,
						msgTarget : 'side',
						width : 400
					},
					
					layout : 'fit',
					width : '100%',
					items : [{
								xtype : 'gridfieldselect',
								name : 'bbgClasses',
								itemId : 'bbgClasses',
								labelAlign : 'right',
								listeners : {
									beforedestroy : function(display){
										display._grid.destroy();
									}
								},
								gridConfig : {
									minHeight : 200,
									height : 250,
									maxHeight : 400,
									width : 400,
									store : store,
									multiSelect : true,
									selModel : {
										selType : 'checkboxmodel'
									},
									columns : [{
												text : i18n.getKey('id'),
												width : 50,
												dataIndex : 'id'
											}, {
												text : i18n.getKey('name'),
												dataIndex : 'name',
												width : 100
											}, {
												text : i18n.getKey('description'),
												dataIndex : 'description',
												width : 200
											}],
									bbar : Ext.create('Ext.PagingToolbar', {
												store : store,
												displayInfo : true,
												emptyMsg : i18n.getKey('noData'),
												listeners : {
													change : pageNumberChanged
												}
											}),
									listeners : {
										deselect : desselect,
										select : selectClass
									}
								}
							}],
					bbar : ["->",{
								text : i18n.getKey('save'),
								handler : submitForm
							},{
								text : i18n.getKey('cancel'),
								handler : function(btn){
									win.close();
								}
							}]
				}
		});
	win.show();
	
	var bbgClassesUpdate = Ext.getCmp('modifyFormPanel');
	setSelect();
	
	function setSelect() {
		var selectModel = bbgClassesUpdate.getComponent('bbgClasses')._grid.getSelectionModel();
		for (var i = 0; i < array.length; i++) {
			var selectClassModel = bbgClassesUpdate.getComponent('bbgClasses')._grid.store
					.getById(array[i]);
			if (selectClassModel != null) {
				selectModel.select(selectClassModel, true);
			}
		}
	}
	
	function desselect(RowModel, record, index) {
		var recordId = record.get('id');
		for (var i = 0; i < array.length; i++) {
			if (recordId == array[i]) {
				Ext.Array.remove(array, array[i]);
			}
		}
	}
	
	function pageNumberChanged(toolbar, data) {
		setSelect();
	}
	
	function selectClass(RowModel, record, index) {
		var recordId = record.get('id');
		var isExist = 0;
		for (var i = 0; i < array.length; i++) {
			if (recordId == array[i]) {
				isExist = 1;
			}
		}
		if (isExist == 0) {
			Ext.Array.push(array, recordId);
		}
	}

	function submitForm() {

		var background = id;
		var str = '';
		for (var i = 0; i < array.length; i++) {
			if(array[i] != null){
				str = str + 'classIds=' + array[i] + '&';
			}
		}
		var url = adminPath + 'api/admin/builderembellishment/'+ background +'/modifyClass?' + str
				+ 'builderEmbellishmentId=' + background ;
		if (background == null || str == '') {
			Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('SelectCategory'));
		} else {
			bbgClassesUpdate.form.submit({
						waitMsg : i18n.getKey('waitMsg'), // '正在提交数据请稍候'
						waitTitle : i18n.getKey('prompt'), // 提示
						headers : {
							Authorization : "Bearer" + Ext.util.Cookies.get("token")
						},
						url : url,
						method : 'PUT',
						success : function(form, action) {
							win.close();
							var p = Ext.getCmp('bbgGridPage');
							p.grid.getStore().loadPage(1);
							Ext.Msg.alert(i18n.getKey('prompt'),
									i18n.getKey('modifySuccess'));
						},
						failure : function(form, action) {
							Ext.Msg.alert(i18n.getKey('prompt'),
									i18n.getKey('modifyfailed'));
						}
					});
		}
	}

}
