const db =
    require("../database/database");

// ========================================
// ALL STUDENT RESULTS
// ========================================

function getAllResults() {

    return db.prepare(`

        SELECT

            assessment_results.id,

            students.first_name,

            students.last_name,

            courses.title AS course_title,

            assessments.title AS assessment_title,

            assessment_results.score,

            assessment_results.total_marks,

            assessment_results.percentage,

            assessment_results.submitted_at

        FROM assessment_results

        JOIN students

        ON students.id =
           assessment_results.student_id

        JOIN assessments

        ON assessments.id =
           assessment_results.assessment_id

        JOIN lessons

        ON lessons.id =
           assessments.lesson_id

        JOIN courses

        ON courses.id =
           lessons.course_id

        ORDER BY

        assessment_results.submitted_at DESC

    `).all();

}
// ========================================
// GRADEBOOK ANALYTICS
// ========================================

function getAnalytics() {

    return db.prepare(`

        SELECT

            COUNT(*) AS attempts,

            ROUND(
                AVG(percentage),
                0
            ) AS average_percentage,

            MAX(percentage)
            AS highest_percentage,

            MIN(percentage)
            AS lowest_percentage


        FROM assessment_results


    `).get();

}
// ========================================
// PERFORMANCE DISTRIBUTION
// ========================================

function getPerformanceDistribution() {

    const results =
        db.prepare(`

            SELECT percentage

            FROM assessment_results

        `).all();


    let distribution = {

        excellent: 0,

        good: 0,

        satisfactory: 0,

        support: 0

    };


    results.forEach(result => {


        if (result.percentage >= 80) {

            distribution.excellent++;

        }

        else if (result.percentage >= 70) {

            distribution.good++;

        }

        else if (result.percentage >= 50) {

            distribution.satisfactory++;

        }

        else {

            distribution.support++;

        }


    });


    return distribution;

}

// ========================================
// TEACHER DASHBOARD ANALYTICS
// ========================================

function getDashboardAnalytics() {

    return db.prepare(`

        SELECT

            COUNT(*) AS total_attempts,

            ROUND(
                AVG(percentage),
                2
            ) AS average_score,

            MAX(percentage) AS highest_score,

            MIN(percentage) AS lowest_score,

            SUM(
                CASE
                    WHEN percentage >= 50 THEN 1
                    ELSE 0
                END
            ) AS passed,

            SUM(
                CASE
                    WHEN percentage < 50 THEN 1
                    ELSE 0
                END
            ) AS failed

        FROM assessment_results

    `).get();

}

// ========================================
// TEACHER SPECIFIC ANALYTICS
// ========================================

function getTeacherAnalytics(teacherId) {


    return db.prepare(`

        SELECT

            COUNT(assessment_results.id)
            AS total_attempts,


            ROUND(
                AVG(assessment_results.percentage),
                2
            )
            AS average_score,


            MAX(assessment_results.percentage)
            AS highest_score,


            SUM(
                CASE
                    WHEN assessment_results.percentage >= 50
                    THEN 1
                    ELSE 0
                END
            )
            AS passed,


            SUM(
                CASE
                    WHEN assessment_results.percentage < 50
                    THEN 1
                    ELSE 0
                END
            )
            AS failed


        FROM assessment_results


        JOIN assessments

        ON assessments.id =
           assessment_results.assessment_id


        JOIN lessons

        ON lessons.id =
           assessments.lesson_id


        JOIN courses

        ON courses.id =
           lessons.course_id


        WHERE courses.teacher_id = ?


    `).get(

        teacherId

    );

}

// ========================================
// TEACHER PASS RATE
// ========================================

function getPassRate(teacherId) {

    return db.prepare(`

        SELECT

            ROUND(

                (

                    SUM(
                        CASE
                            WHEN assessment_results.percentage >= 50
                            THEN 1
                            ELSE 0
                        END
                    )

                    * 100.0

                    /

                    COUNT(*)

                ),

                0

            ) AS pass_rate


        FROM assessment_results


        JOIN assessments

        ON assessments.id =
           assessment_results.assessment_id


        JOIN lessons

        ON lessons.id =
           assessments.lesson_id


        JOIN courses

        ON courses.id =
           lessons.course_id


        WHERE courses.teacher_id = ?


    `).get(teacherId);

}



// ========================================
// PERFORMANCE DISTRIBUTION
// ========================================

function getTeacherPerformanceDistribution(teacherId) {


    const results = db.prepare(`

        SELECT

            assessment_results.percentage


        FROM assessment_results


        JOIN assessments

        ON assessments.id =
           assessment_results.assessment_id


        JOIN lessons

        ON lessons.id =
           assessments.lesson_id


        JOIN courses

        ON courses.id =
           lessons.course_id


        WHERE courses.teacher_id = ?


    `).all(teacherId);



    const distribution = {

        excellent: 0,

        good: 0,

        satisfactory: 0,

        support: 0

    };



    results.forEach(result => {


        if(result.percentage >= 80){

            distribution.excellent++;

        }

        else if(result.percentage >= 70){

            distribution.good++;

        }

        else if(result.percentage >= 50){

            distribution.satisfactory++;

        }

        else {

            distribution.support++;

        }


    });


    return distribution;

}



// ========================================
// TOP STUDENTS
// ========================================

function getTopStudents(teacherId) {


    return db.prepare(`

        SELECT


            students.first_name,

            students.last_name,


            ROUND(
                AVG(
                    assessment_results.percentage
                ),

                0

            ) AS average_score



        FROM assessment_results


        JOIN students

        ON students.id =
           assessment_results.student_id


        JOIN assessments

        ON assessments.id =
           assessment_results.assessment_id


        JOIN lessons

        ON lessons.id =
           assessments.lesson_id


        JOIN courses

        ON courses.id =
           lessons.course_id


        WHERE courses.teacher_id = ?


        GROUP BY students.id


        ORDER BY average_score DESC


        LIMIT 5


    `).all(teacherId);

}

    module.exports = {

        getAllResults,
        getAnalytics,
        getPerformanceDistribution,
        getDashboardAnalytics,
        getTeacherAnalytics,
            getPassRate,
    getTeacherPerformanceDistribution,
    getTopStudents

    };