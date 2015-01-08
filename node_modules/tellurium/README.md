	+----+
	| Te |
	+----+

Tellurium is a JavaScript Testing Framework using testing patterns like Mock, Stub, and Spy.

## Features:

* Support asynchronous specifications by default
* Support syncronous specifications via .sync()
* Support Scripted test by default
* Support guided tests via .guided()
* ... (yes there is more but why dont you give it a try?)

This framework tries to go as close as possible with EcmaScript behaviour. so if you used anothers language
testing frameworks you may find that some of your tools are not here but trust me its better this way.

## Does it work?
Yes Tellurium is tested with Tellurium

## Is is used for other projects?
Yes it is but not many yet. but it really works, if not pls send me an issue or a msg.

## Ok how can I use it?

	var someObj = {
	  good : true;
	};

	Tellurium.suite('my first test')({
	  this.specify('someObj must be good')({
	    this.assert(someObj.good).toBe(true);
	  });
	});

	Tellurium.run();

## Theory of Operation

Tellurium was designed to do front-end testing. this is a very important thing to consider because environment is very different from server side environments, so there is a number of objects that may be colliding and interacting to form a web application. Complex web applications tend to be event driven and not so much procedural because of the interaction of the user, network, and other events happening on the system in different order and on different times.

Creating such system is not very easy to organize but there was some work done before and following the principle of unix of having small units of code that perform one task well, Tellurium has a number of dependencies instead of trying to build everything from the ground up.

## Testing

* **Test Method**
    
    Where do we put our test code? 
    
    *We encode each test as a single Test Method on some class.*
    
* **Four-Phase Test** (Setup -> Exercise -> Verify -> Teardown)
    
    How do we structure our test logic to make what we are testing obvious?
    
    *We structure each test with four distinct parts executed in sequence.*
    
* **Assertion Method**
    
    How do we make tests self-checking?
    
    *We call a utility method to evaluate whether an expected outcome has been achieved.*
    
* **Assertion Message**
    
    How do we structure our test logic to know which assertion failed?
    
    *We include a descriptive string argument in each call to an Assertion Method.*
    
* **Testcase** 

    Where do we put our test code?
    
    *Class We group a set of related Test Methods on a single Testcase Class.*

* **Test Runner**
    
    How do we run the tests?
    
    *We define an application that instantiates a Test Suite Object and executes all the Testcase Objects it contains.*
    
* **Testcase Object**

    How do we run the tests?

    *We create a Command object for each test and call the run method when we wish to execute it.*
    
* **Test Suite Object**
    
    How do we run the tests when we have many tests to run?
    
    *We define a collection class that implements the standard test interface and use it to run a set of related Testcase Objects.*
    
* **Test Discovery**
    
    How does the Test Runner know which tests to run?
    
    The Test Automation Framework discovers all tests that belong to the test suite automatically.
    
* **Test Enumeration**
    
    How does the Test Runner know which tests to run?
    
    The test automater manually writes the code that enumerates all tests that belong to the test suite.

* **Test Selection**
    
    How does the Test Runner know which tests to run?
    
    *The Test Automation Framework selects the Test Methods to be run at runtime based on attributes of the tests.*

## This Library is based on the xUnit Test Patterns Book.

* **Stub**
	
	How can we verify logic independently when it depends on indirect inputs from other software components?
	
	*We replace a real object with a test-specific object that feeds the desired indirect inputs into the system under test.*
	
* **Spy**

	How do we implement Behavior Verification? How can we verify logic independently when it has indirect outputs to other software components?
	
	*We use a Test Double to capture the indirect output calls made to another component by the SUT for later verification by the test.*
	
* **Mock**

	How do we implement Behavior Verification for indirect outputs of the SUT? How can we verify logic independently when it depends on indirect inputs from other software components?
	
	*We replace an object on which the SUT depends on with a test-specific object that verifies it is being used correctly by the SUT.*
	
* **Assertion**

	How do we make tests self-checking?
	
	*We call a utility method to evaluate whether an expected outcome has been achieved.*

* **Fresh Fixture Setup**

	* **Inline-Setup**

		How do we construct the Fresh Fixture?
		
		*Each Test Method creates its own Fresh Fixture by calling the appropriate constructor methods to build exactly the test fixture it requires.*

	* **Delegated Setup**
	
		How do we construct the Fresh Fixture?
		
		*Each Test Method creates its own Fresh Fixture by calling Creation Methods from within the Test Methods.*

	* **Creation Method**
		How do we construct the Fresh Fixture?
		
		*We set up the test fixture by calling methods that hide the mechanics of building ready-to-use objects behind Intent-Revealing Names.*
		
	* 	**Implicit Setup** 
	
		How do we construct the Fresh Fixture?
		
		*We build the test fixture common to several tests in the setUp method.*

* **Shared Fixture Construction**

	* **Prebuilt Fixture**
		
		How do we cause the Shared Fixture to be built before the first test method that needs it?
		
		*We build the Shared Fixture separately from running the tests.*
		
	* **Lazy Setup**
		
		How do we cause the Shared Fixture to be built before the first test method that needs it?
		
		*We use Lazy Initialization of the fixture to create it in the first test that needs it.*
		
	* **Suite Fixture Setup**
		
		How do we cause the Shared Fixture to be built before the first test method that needs it?
		
		*We build/destroy the shared fixture in special methods called by the Test Automation Framework before/after the first/last Test Method is called.*
		
	* **Setup Decorator**
		
		How do we cause the Shared Fixture to be built before the first test method that needs it?
		
		*We wrap the test suite with a Decorator that sets up the shared test fixture before running the tests and tears it down after all tests are done.*
		
	* **Chained Tests**
        
        How do we cause the Shared Fixture to be built before the first test method that needs it?
        
        *We let the other tests in a test suite set up the test fixture.*
        
## Testing Strategies

* **Recorded Test**
    
    How do we prepare automated tests for our software?
    
    *We automate tests by recording interactions with the application and playing them back using a test tool.*
    
* **Scripted Test**
    
    How do we prepare automated tests for our software?
    
    *We automate the tests by writing test programs by hand.*
    
* **Data-Driven Test**
    
    How do we prepare automated tests for our software? How do we reduce Test Code Duplication?
    
    *We store all the information needed for each test in a data file and write an interpreter that reads the file and executes the tests.*
    
* **Guided Test**
    
    How do we prepare automated tests for our software? How do we not forget a test?
    
    *We combine scripted or data-driven test with something similar to a recorded test (but that recorded process cannot dupplicate). and guide the tester trough the tests.*
    
    

### Dependencies

* Neon (Object Organization DSL)
* CustomEvent (Synthetic events for objects)
* CustomEventSupport (Includable module to give the ability of customEvents to an object)

### Objects from Tellurium

* Tellurium (<<Module>> <<NameSpace>> <<Runner>>. is the initial point of almost all operations);
* Tellurium.Stub (<<Constructor>>. Mechanism to define a non implemented property)
* Tellurium.Stub.Factory (<<Module>>. Provides Stub functionality to an Object)
* Tellurium.Spy
* Tellurium.Spy.Factory
* Tellurium.Assertion
* Tellurium.Context
* Tellurium.Suite
* Tellurium.Description
* Tellurium.Specification
* Tellurium.Reporter

