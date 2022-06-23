from email.policy import default
from exts import db

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    forename = db.Column(db.String(80))
    surname = db.Column(db.String(80))
    username = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80))
    subject = db.Column(db.String(80))
    numberOfYears = db.Column(db.Integer, default=3)
    #Create relation
    years = db.relationship('YearsOfStudy',backref='student',lazy=True)

    """ Method to help return string representation of obejects of this class """
    def __repr__(self):
        return f"<User {self.id} {self.forename} {self.surname} {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self,id,forename,surname,username,email,passowrd,subject,numberOfYears):
        self.id = id
        self.forename = forename
        self.surname = surname
        self.username = username
        self.email = email
        self.password = passowrd
        self.subject = subject
        self.numberOfYears = numberOfYears

        db.session.commit()


class YearsOfStudy(db.Model):
    __tablename__ = 'yearsOfStudy'

    id = db.Column(db.Integer, primary_key=True)
    yearNumber = db.Column(db.Integer)
    student_ID = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    #Create relation
    modules = db.relationship('Module',backref='subjectYear',lazy=True)

    def add(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Module(db.Model):
    __tablename__ = 'module'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    creditsWorth = db.Column(db.Integer)
    assignments = db.Column(db.Integer)
    student_year_ID = db.Column(db.Integer, db.ForeignKey('yearsOfStudy.id'),nullable=False)
    #Create relation
    work = db.relationship('Assignment',backref='subjectModule',lazy=True)


    def add(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self,id,name,creditsWorth,assignments,student_year_ID):
        self.id = id
        self.name = name
        self.creditsWorth = creditsWorth
        self.assignments = assignments
        self.student_year_ID = student_year_ID

        db.session.commit()

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    weight = db.Column(db.Integer)
    completed = db.Column(db.Boolean, default=False)
    percentage = db.Column(db.Integer)
    module_ID = db.Column(db.Integer, db.ForeignKey('module.id'),nullable=False)

    def add(self):
        db.session.add(self)
        db.session.commit()
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self,id,name,weight,completed,percentage,module_ID):
        self.id = id
        self.name = name
        self.weight = weight
        self.completed = completed
        self.percentage = percentage
        self.module_ID = module_ID

        db.session.commit()
    
    