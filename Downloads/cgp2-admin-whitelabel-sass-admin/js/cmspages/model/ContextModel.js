Ext.define('CGP.cmspages.model.ContextModel',{
	 extend:'Ext.data.Model',
	 idProperty:'_id',
	 fields: [
		{
			name: '_id',
			type: 'int',
			useNull: true
		},
		 {
			 name:'clazz',
			 type:'string',
			 defaultValue: 'com.qpp.domain.cms.CMSContext'
		 },
		 {
			 name: 'name',
			 type: 'string'
		 },
		{
			name: 'variables',
			type: 'array'
		},
		 {
			 name: 'displayName',
			 type: 'string',
			 convert: function (value, record) {
				 return record.get('name') + '<' + record.get('_id') + '>'
			 }
		 }
	],
	 proxy: {
		type: 'uxrest',
		url: cmsPagePath + 'api/cms-saas-context',
		reader: {
			type: 'json',
			root: 'data'
		}
	}
})