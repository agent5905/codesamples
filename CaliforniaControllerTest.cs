using Xunit;
using Rome.Controllers.US;
using Rome.Contracts.DAL;
using Microsoft.AspNetCore.Mvc.Testing;
using Rome.Contracts;
using Moq;
using System.Data;
using Rome.Models;
using RomeTest.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Rome.DAL;
using Rome.Managers;
using AutoMapper;
using Rome.Common.Mapping;
using MassTransit;
using Rome.Common.DTO;
using System.Configuration;
using Rome.Contracts.Managers;
using System.Threading.Tasks;
using AutoFixture;
using Rome.Models.Data;
using Rome.Controllers.California;
using System;
using System.Reflection;

namespace RomeTest.Controllers
{
    public class CaliforniaControllerTest : IClassFixture<WebApplicationFactory<Rome.Startup>>
    {
        private readonly WebApplicationFactory<Rome.Startup> _factory;

        public CaliforniaControllerTest(WebApplicationFactory<Rome.Startup> factory)
        {
            _factory = factory;
        }

        [Fact]
        public void Aircraft_True()
        {
            ControllerTest<Aircraft, AircraftDTO>("Aircraft");
        }

        [Fact]
        public void AJIS_True()
        {
            ControllerTest<AJIS, AJISDTO>("AJIS");
        }

        [Fact]
        public void ArmedProhibitedPersons_True()
        {
            ControllerTest<ArmedAndProhibited, ArmedAndProhibitedDTO>("ArmedProhibitedPersons");
        }

        [Fact]
        public void Boat_True()
        {
            ControllerTest<Boat, BoatDTO>("Boat");
        }

        [Fact]
        public void BoatNlets_True()
        {
            ControllerTest<Boat, BoatDTO>("BoatNlets");
        }

        [Fact]
        public void Bond_True()
        {
            ControllerTest<Bond, BondDTO>("Bond");
        }

        [Fact]
        public void Carpos_True()
        {
            ControllerTest<RestrainingOrder, RestrainingOrderDTO>("Carpos");
        }

        [Fact]
        public void CjisHitConfirmation_True()
        {
            ControllerTest<HitConfirmation, HitConfirmationDTO>("CjisHitConfirmation");
        }

        [Fact]
        public void CletsAdminMessage_True()
        {
            ControllerTest<AdminMessage, AdminMessageDTO>("CletsAdminMessage");
        }

        [Fact]
        public void CriminalHistory_True()
        {
            ControllerTest<CriminalHistory, CriminalHistoryDTO>("CriminalHistory");
        }

        [Fact]
        public void DMV_True()
        {
            ControllerTest<DMV, DMVDTO>("DMV");
        }

        [Fact]
        public void DMVNlets_True()
        {
            ControllerTest<DMV, DMVDTO>("DMVNlets");
        }

        [Fact]
        public void Firearm_True()
        {
            ControllerTest<Firearm, FirearmDTO>("Firearm");
        }
        
        [Fact]
        public void Hazmat_True()
        {
            ControllerTest<Hazmat, HazmatDTO> ("Hazmat");
        }

        [Fact]
        public void HitRequest_True()
        {
            ControllerTest<HitConfirmation, HitConfirmationDTO>("HitRequest");
        }
        
        [Fact]
        public void JdicAdminMessage_True()
        {
            ControllerTest<AdminMessage, AdminMessageDTO>("JdicAdminMessage");
        }

        [Fact]
        public void Juvenile_True()
        {
            ControllerTest<Juvenile, JuvenileDTO>("Juvenile");
        }

        [Fact]
        public void LAConsolidatedCriminalHistory_True()
        {
            ControllerTest<CCHRS, CCHRSDTO>("LAConsolidatedCriminalHistory");
        }

        [Fact]
        public void MentalHealthFirearms_True()
        {
            ControllerTest<MentalHealthFirearm, MentalHealthFirearmDTO>("MentalHealthFirearms");
        }

        [Fact]
        public void MissingPerson_True()
        {
            ControllerTest<MissingPerson, MissingPersonDTO>("MissingPerson");
        }

        [Fact]
        public void NletsAdminMessage_True()
        {
            ControllerTest<AdminMessage, AdminMessageDTO>("NletsAdminMessage");
        }

        [Fact]
        public void Orion_True()
        {
            ControllerTest<Orion, OrionDTO>("Orion");
        }

        [Fact]
        public void Property_True()
        {
            ControllerTest<Property, PropertyDTO>("Property");
        }

        [Fact]
        public void SendCletsFreeform_True()
        {
            ControllerTest<string, string>("SendCletsFreeform");
        }

        [Fact]
        public void SexAndArson_True()
        {
            ControllerTest<SexAndArson, SexAndArsonDTO>("SexAndArson");
        }

        [Fact]
        public void StolenVehicle_True()
        {
            ControllerTest<StolenVehicle, StolenVehicleDTO>("StolenVehicle");
        }

        [Fact]
        public void SupervisedReleasedFile_True()
        {
            ControllerTest<SupervisedReleaseFile, SupervisedReleaseFileDTO>("SupervisedReleasedFile");
        }

        [Fact]
        public void UnidentifiedPerson_True()
        {
            ControllerTest<UnidentifiedPerson, UnidentifiedPersonDTO>("UnidentifiedPerson");
        }

        [Fact]
        public void ViolentPerson_True()
        {
            ControllerTest<ViolentPerson, ViolentPersonDTO>("ViolentPerson");
        }

        [Fact]
        public void WantedPerson_True()
        {
            ControllerTest<WantedPerson, WantedPersonDTO>("WantedPerson");
        }

        [Fact]
        public void WarrantRecall_True()
        {
            ControllerTest<Warrant, WarrantDTO>("WarrantRecall");
        }

        private void ControllerTest<T,U>(string method)
        {
            Fixture fixture = new Fixture();
            var mockDatabase = new Mock<IDatabase>();
            var mockManager = new Mock<IInquiryManager>();
            var mapConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new MapperProfile());
            });
            var mapper = mapConfig.CreateMapper();
            var mockBus = new Mock<IBusControl>();
            var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            var context = new DefaultHttpContext();
            context.Request.Headers["ORI"] = "TestORI";
            context.Request.Headers["Username"] = "TestUsername";
            context.Request.Headers["TerminalId"] = "1";
            context.Request.Headers["RequestID"] = "1";

            mockHttpContextAccessor.Setup(cf => cf.HttpContext).Returns(context);

            mockDatabase.Setup(x => x.GetSwitchNameByOri(It.IsAny<string>())).Returns("TestSwitchName");
            mockManager.Setup(x => x.SendMessageToRouter(It.IsAny<string>(), It.IsAny<string>())).Returns(Task.FromResult(true));
            mockManager.Setup(x => x.SendNLETSRequest(It.IsAny<T>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).
                ReturnsAsync(new MessageSwitchApiResult(true, new string[] { "Failed to send data" }));
            mockManager.Setup(x => x.SendCaliforniaV2Request(It.IsAny<T>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).
                ReturnsAsync(new MessageSwitchApiResult(true, new string[] { "Failed to send data" }));
            mockManager.Setup(x => x.SendCLETSFreeform(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).
                ReturnsAsync(new MessageSwitchApiResult(true, new string[] { "Failed to send data" }));

            CaliforniaController controller = new CaliforniaController(mockDatabase.Object, mockManager.Object, mapper, mockHttpContextAccessor.Object);

            U dto = fixture.Create<U>();

            MethodInfo methodInfo = controller.GetType().GetMethod(method);
            var result = methodInfo.Invoke(controller, new object[] { dto, "serachBy", "" });

            var taskResult = Assert.IsType<Task<IActionResult>>(result);
            ActionResult actionResult = taskResult.Result as ActionResult;

            Assert.IsType<OkObjectResult>(actionResult);
            OkObjectResult okResult = actionResult as OkObjectResult;
            Assert.NotNull(okResult);

            var message = okResult.Value as MessageSwitchApiResult;
            Assert.NotNull(message);

            Assert.True(message.IsSuccessful);
        }

    }
}
