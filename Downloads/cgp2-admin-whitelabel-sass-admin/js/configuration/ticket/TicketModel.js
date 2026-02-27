Ext.define('CGP.configuration.ticket.TicketModel',{
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		type : 'int',
		useNull: true
	},{
		name: 'emails', 
		type: 'string'
	},{
		name: 'websiteId',
		type: 'int'
	},{
		name : 'websiteName',
		type : 'string'
	}],
	proxy : {
		type : 'uxrest',
		url : adminPath + 'api/ticketReceivers',
		reader:{
			type:'json',
			root:'data'
		},
		writer: {
			type : 'json'
		}
	}
});