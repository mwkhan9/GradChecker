from flask_restx import Namespace,Resource,fields
from models import User,YearsOfStudy,Module,Assignment
from flask_jwt_extended import jwt_required
from flask import request,jsonify,make_response


grades_ns=Namespace('grades',description="A namespace for User Grades")

user_model = grades_ns.model(
    'User',
    {
        "id":fields.Integer(),
        "forename": fields.String(),
        "surname": fields.String(),
        "username": fields.String(),
        "email": fields.String(),
        "password": fields.String(),
        "subject": fields.String(),
        "numberOfYears": fields.Integer(),
    }
)

year_model = grades_ns.model(
    'YearsOfStudy',
    {
        'id':fields.Integer(),
        'yearNumber':fields.Integer()
    }
)

yearid_model = grades_ns.model(
    'YearsOfStudy',
    {
        'id':fields.Integer(),
    }
)

module_model = grades_ns.model(
    'Module',
    {
        "id":fields.Integer(),
        'name':fields.String(),
        'creditsWorth':fields.Integer(),
        'assignments': fields.Integer(),
        'subjectYear.yearNumber':fields.Integer()
    }
)

module_delete_model = grades_ns.model(
    'Module',
    {
        'name':fields.String(),
    }
)

assignment_model = grades_ns.model(
    'Assignment',
    {
        'name':fields.String(),
        'weight':fields.Integer(),
        'completed': fields.Boolean(),
        'percentage':fields.Integer()
    }
)

@grades_ns.route('/years/<int:user_id>')
class YearResources(Resource):

    @grades_ns.marshal_with(year_model)
    def get(self,user_id):
        """Get years by user id """
        
        user=User.query.get_or_404(user_id)
        return user.years



    #@grades_ns.expect(year_model)
    #@jwt_required()
    def put(self,user_id):
        """add a new year for user by their id """
        user=User.query.get_or_404(user_id)
        data=request.get_json()
        
        #Check if number already exists & is <=4
        yearNumber=data.get('yearNumber')
        years = YearsOfStudy.query.filter_by(student_ID = user_id)
        for year in years:
            if year.yearNumber == yearNumber:
                return jsonify({"message":"this year has already been added"})
        if yearNumber>4:
            return jsonify({"message":"this year is out of range"})

        new_year = YearsOfStudy(
            yearNumber = data.get('yearNumber'),
            student_ID = user_id
        )
        new_year.add()
        return make_response(jsonify({"message":"Year added successfuly"}),201)


    @grades_ns.expect(year_model)
    @jwt_required()
    def delete(self,user_id):
        """Delete a year by user id """
        user=User.query.get_or_404(user_id)
        data=request.get_json()
        yearNumber=data.get('yearNumber')

        years = YearsOfStudy.query.filter_by(student_ID = user_id)
        for year in years:
            if year.yearNumber == yearNumber:
                year.delete()
                return jsonify({"message":"this year has been deleted"})
        
        return jsonify({"message":"this year doesn't seem to exist"})

@grades_ns.route('/getYearIds/<int:user_id>')
class YearResources(Resource):
    
    @grades_ns.marshal_with(yearid_model)
    def get(self,user_id):
        """Get list of year ids for user_id """
  
        arrayOfYears = []
        years = YearsOfStudy.query.filter_by(student_ID = user_id)
        for year in years:
            arrayOfYears.append(year)
        
        return arrayOfYears


@grades_ns.route('/modules/<int:year_id>')  
class ModuleResources(Resource):
    
    @grades_ns.marshal_with(module_model)
    def get(self,year_id):
        """Get modules by year id """
        year=YearsOfStudy.query.get_or_404(year_id)

        return year.modules

    @grades_ns.expect(module_model)
    @jwt_required()
    def put(self,year_id):
        """add a new module to a year id """
        year=YearsOfStudy.query.get_or_404(year_id)
        data=request.get_json()
        
        #Check if module name already exists 
        moduleName=data.get('name')
        modules = Module.query.filter_by(student_year_ID = year_id)
        for module in modules:
            if module.name == moduleName:
                return jsonify({"message":"this module has already been added"})


        new_module = Module(
            name = data.get('name'),
            creditsWorth = data.get('creditsWorth'),
            assignments = data.get('assignments'),
            student_year_ID = year_id
        )

        new_module.add()
        return make_response(jsonify({"message":"Module added successfuly"}),201)


    @grades_ns.expect(module_delete_model)
    @jwt_required()
    def delete(self,year_id):
        """Delete a module by year id """
        year=YearsOfStudy.query.get_or_404(year_id)
        data=request.get_json()
        moduleName=data.get('name')

        modules = Module.query.filter_by(student_year_ID = year_id)
        for module in modules:
            if module.name == moduleName:
                #First delete all years inside it:
                for assignment in module.work:
                    assignment.delete()
                #
                module.delete()
                return jsonify({"message":"this module has been deleted"})
        
        return jsonify({"message":"this module doesn't seem to exist"})


@grades_ns.route('/update/<int:year_id>')
class ModuleResources(Resource):

    @grades_ns.expect(module_model)
    @jwt_required()
    def put(self,year_id):
        """Update a module by year id """
        
        year=YearsOfStudy.query.get_or_404(year_id)
        data=request.get_json()
        moduleName=data.get('currentName')

        #Check if module name already exists 
        modules = Module.query.filter_by(student_year_ID = year_id)
        if(data.get('name')!=data.get('currentName')):
            for module in modules:
                if module.name == data.get('name'):
                    return jsonify({"message":"this module name has already been added"})
        
        modules = Module.query.filter_by(student_year_ID = year_id)
        for module in modules:
            if module.name == moduleName:
                module.update(module.id, data.get('name'),data.get('creditsWorth'),data.get('assignments'), year_id)
                return jsonify({"message":"this module has been updated"})

        return jsonify({"message":"this module doesn't seem to exist"})


@grades_ns.route('/assignments/<int:module_id>')   
class AssignmentResources(Resource):
    
    @grades_ns.marshal_with(assignment_model)
    def get(self,module_id):
        """Get assignent by modules id """
        module=Module.query.get_or_404(module_id)

        return module.work
    
    @grades_ns.expect(assignment_model)
    @jwt_required()
    def put(self,module_id):
        """add a new assignment to a module id """
        module=Module.query.get_or_404(module_id)
        data=request.get_json()
        
        #Check if assignment name already exists 
        assignmentName=data.get('name')
        assignments = Assignment.query.filter_by(module_ID = module_id)
        for assignment in assignments:
            if assignment.name == assignmentName:
                return jsonify({"message":"this assignment has already been added"})


        new_assignent = Assignment(
            name = data.get('name'),
            weight = data.get('weight'),
            completed = data.get('completed'),
            percentage = data.get('percentage'),
            module_ID = module_id
        )

        new_assignent.add()
        return make_response(jsonify({"message":"Assignment added successfuly"}),201)
    
    @grades_ns.expect(assignment_model)
    @jwt_required()
    def delete(self,module_id):
        """Delete a assignment by year id """
        module=Module.query.get_or_404(module_id)
        data=request.get_json()
        assignmentName=data.get('name')

        assignments = Assignment.query.filter_by(module_ID = module_id)
        for assignment in assignments:
            if assignment.name == assignmentName:
                assignment.delete()
                return jsonify({"message":"this assignment has been deleted"})
        
        return jsonify({"message":"this assignment doesn't seem to exist"})

@grades_ns.route('/updateAssgn/<int:module_id>')  
class AssignmentResources(Resource):

    @grades_ns.expect(assignment_model)
    @jwt_required()
    def put(self,module_id):
        """Update a assignment by year id """
        
        module=Module.query.get_or_404(module_id)
        data=request.get_json()
        assignmentName=data.get('currentName')
        
        #Check if assignment name already exists - if its not the same as its current name
        Name=data.get('name')
        currentName = data.get('currentName')
        if (currentName!=Name):
            assignments = Assignment.query.filter_by(module_ID = module_id)
            for assignment in assignments:
                if assignment.name == assignmentName:
                    return jsonify({"message":"this assignment name has already been added"})        
        
        assignments = Assignment.query.filter_by(module_ID = module_id)
        for assignment in assignments:
            if assignment.name == assignmentName:
                assignment.update(assignment.id, data.get('name'),data.get('weight'),data.get('completed'),data.get('percentage'), module_id)
                return jsonify({"message":"this assignment has been updated"})

        return jsonify({"message":"this assignment doesn't seem to exist"})


#                           FUNCTION: getModuleTotal                    #
@grades_ns.route('/calcModule/<int:module_id>') 
class calcModuleResources(Resource):

    def get(self,module_id):
        module=Module.query.get_or_404(module_id)
        assignments = module.work

        totalMark = 0
        totalPerc = 0
        rollingGrade = 0
        names = []
        for assignment in assignments:
            if assignment.completed:
                totalMark+=assignment.percentage * (assignment.weight/100)
                totalPerc+=assignment.weight
                names.append(assignment.name)

        if totalPerc ==0:
            rollingGrade += 0
        else:
            rollingGrade = (totalMark/totalPerc)*100
    
        return round(rollingGrade,2)

#                           FUNCTION: getOverallYear                    #
@grades_ns.route('/calcYear/<int:year_id>')   
class calcModuleResources(Resource):

    def get(self,year_id):
        year=YearsOfStudy.query.get_or_404(year_id)
        modules = year.modules

        totalCredits = 0
        yearTotalPerc = 0
        names = []
        for module in modules:
            names.append(module.name)
            ### getModuleTotal ###
            assignments = module.work

            totalMark = 0
            totalPerc = 0
            rollingGrade = 0
            for assignment in assignments:
                if assignment.completed:
                    totalMark+=assignment.percentage * (assignment.weight/100)
                    totalPerc+=assignment.weight
            
            if totalPerc ==0:
                rollingGrade += 0
            else:
                rollingGrade = (totalMark/totalPerc)*100
            ### END Module total ###

            yearTotalPerc+=rollingGrade*module.creditsWorth
            if(rollingGrade*module.creditsWorth)== 0:
                totalCredits+=0
            else:
                totalCredits+=module.creditsWorth
            
        if totalCredits==0:
            overallYearGrade=0
        else:
            overallYearGrade = (yearTotalPerc/totalCredits)
    
        return  round(overallYearGrade,2)